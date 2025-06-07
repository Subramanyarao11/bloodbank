import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthResponse } from './dto/auth.types';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../users/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const { email, password, role, ...userData } = registerInput;

    this.validateRoleRequiredFields(role, userData);

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersService.create({
      ...userData,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.jwtService.sign({ userId: user.id });

    return {
      token,
      user,
      success: true,
      message: 'User registered successfully',
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password, role } = loginInput;
    const user = await this.usersService.findByEmail(email);

    const isValidUser = user != null;
    const isValidRole = user?.role === role;
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isValidUser || !isValidRole || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role });

    return {
      token,
      user,
      success: true,
      message: 'Login successful',
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private validateRoleRequiredFields(role: UserRole, userData: any) {
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.DONOR:
        if (!userData.name) {
          throw new BadRequestException('Name is required for this role');
        }
        break;
      case UserRole.ORGANISATION:
        if (!userData.organisationName) {
          throw new BadRequestException('Organisation name is required');
        }
        break;
      case UserRole.HOSPITAL:
        if (!userData.hospitalName) {
          throw new BadRequestException('Hospital name is required');
        }
        break;
    }
  }
}
