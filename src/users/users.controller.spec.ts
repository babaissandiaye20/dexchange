/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock du UsersService
  const mockUsersService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      password: 'Password123',
      name: 'Test User',
    };

    const registeredUser = {
      user: {
        id: 'someId',
        email: createUserDto.email,
        name: createUserDto.name,
      },
    };

    it('should successfully register a new user', async () => {
      mockUsersService.register.mockResolvedValue(registeredUser);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(registeredUser);
      expect(mockUsersService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUsersService.register.mockRejectedValue(
        new ConflictException('Cet email est déjà utilisé'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@test.com',
      password: 'Password123',
    };

    const loginResponse = {
      user: {
        id: 'someId',
        email: loginUserDto.email,
        name: 'Test User',
      },
      token: 'jwt-token',
    };

    it('should successfully login a user', async () => {
      mockUsersService.login.mockResolvedValue(loginResponse);

      const result = await controller.login(loginUserDto);

      expect(result).toEqual(loginResponse);
      expect(mockUsersService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockUsersService.login.mockRejectedValue(
        new UnauthorizedException('Email ou mot de passe incorrect'),
      );

      await expect(controller.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
