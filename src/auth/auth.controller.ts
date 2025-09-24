import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { SignupUserDto } from '../user/dto/signupUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
