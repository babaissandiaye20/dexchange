/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Model } from 'mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUserInstance = {
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = {
      email: 'test@test.com',
      password: 'Password123',
      name: 'Test User',
    };

    it('should successfully register a new user', async () => {
      const savedUser = {
        _id: 'someId',
        ...createUserDto,
      };

      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      mockUserModel.create = jest
        .fn()
        .mockImplementation(() => mockUserInstance);
      mockUserInstance.save = jest.fn().mockResolvedValue(savedUser);

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        user: {
          id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: createUserDto.email }),
      });

      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginUserDto = {
      email: 'test@test.com',
      password: 'Password123',
    };

    it('should successfully login a user', async () => {
      const user = {
        _id: 'someId',
        email: loginUserDto.email,
        name: 'Test User',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      mockJwtService.sign = jest.fn().mockReturnValue('jwt-token');

      const result = await service.login(loginUserDto);

      expect(result).toEqual({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
