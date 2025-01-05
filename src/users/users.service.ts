// users.service.ts
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './entities/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel
        .findOne({
          email: createUserDto.email,
        })
        .exec();

      if (existingUser) {
        throw new ConflictException('Cet email est déjà utilisé');
      }

      const newUser = new this.userModel(createUserDto);
      await newUser.save();

      return {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création de l'utilisateur",
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel
        .findOne({
          email: loginUserDto.email,
        })
        .exec();

      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      const isPasswordValid = await user.comparePassword(loginUserDto.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      const token = this.jwtService.sign({
        userId: user._id,
        email: user.email,
      });

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la connexion');
    }
  }
}
