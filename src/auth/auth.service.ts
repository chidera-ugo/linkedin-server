import { Injectable } from '@nestjs/common';
import { AuthDto } from './dtos';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(authDto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.create(authDto);
    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(tokens.refresh_token, user.id);
    return tokens;
  }

  async loginUser(authDto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.validateUser(authDto);
    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(tokens.refresh_token, user.id);
    return tokens;
  }

  async getTokens(user: UserEntity): Promise<Tokens> {
    const payload = { email: user.email, sub: user.id };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
