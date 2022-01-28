import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.register(authDto);
  }

  @Post('login')
  signin() {
    // return this.authService.loginUser();
  }

  @Post('logout')
  logout() {
    // return this.authService.logoutUser();
  }

  @Post('refresh')
  refresh() {
    // return this.authService.refreshToken();
  }
}
