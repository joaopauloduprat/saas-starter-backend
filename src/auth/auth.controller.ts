import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: { email: string; password: string }) {
    return this.authService.signup({
      email: body.email,
      password: body.password,
    });
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login({
      email: body.email,
      password: body.password,
    });
  }
}
