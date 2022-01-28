import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['qid'];
    }
    return token;
  }

  validate(req: Request, payload: any) {
    // const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    const refreshToken = this.cookieExtractor(req);

    return {
      ...payload,
      refreshToken,
    };
  }
}
