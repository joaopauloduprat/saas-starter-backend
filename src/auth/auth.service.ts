import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: { email: string; password: string; name?: string }) {
    const existingEmail = await this.userService.findByEmail(dto.email);
    if (existingEmail) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    return {
      user: new UserEntity(user),
      access_token: this.signToken(user.id, user.email),
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordMatched = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials');

    return {
      user: new UserEntity(user),
      access_token: this.signToken(user.id, user.email),
    };
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
