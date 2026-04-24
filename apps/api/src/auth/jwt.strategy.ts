import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.service';
import { JwtUser } from './jwt.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token = req.cookies?.token;
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return { id: payload.sub };
  }
}
