import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';
import { Tokens } from './types';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.registerUser(authDto);
  }

  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.loginUser(authDto);
    res.cookie('qid', tokens.access_token, {
      httpOnly: true,
      secure: true,
    });

    return tokens;
  }

  @Post('logout')
  logout() {
    // return this.authService.logoutUser();
  }

  @Post('refresh')
  refresh(@Req() req: Request) {
    console.log(req.cookies);
    // return this.authService.refreshToken();
  }
}
