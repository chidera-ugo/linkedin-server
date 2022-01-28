import { Injectable } from '@nestjs/common';
import { AuthDto } from './dtos';
import * as argon from 'argon2';
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

  async validateUser(authDto: AuthDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(authDto.email);
    if (!user) return null;
    const validPassword = await argon.verify(user.password, authDto.password);
    if (!validPassword) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(authDto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.create(authDto);
    const tokens = await this.getTokens(user);
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
