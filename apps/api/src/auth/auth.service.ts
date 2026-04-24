import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from 'db';
import { TRPCError } from '@trpc/server';

export interface JwtPayload {
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
        },
      });

      const token = this.jwt.sign({ sub: user.id });

      return { id: user.id, email: user.email, token };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // throw new BadRequestException(
        //   `User with email "${dto.email}" already excist`,
        // );
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Пользователь с email "${dto.email}" уже существует`,
        });
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Неверные учетные данные',
      });
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Неверные учетные данные',
      });
    }

    const token = this.jwt.sign({ sub: user.id });

    return {
      user: { id: user.id, email: user.email },
      token,
    };
  }

  logout() {
    return { success: true };
  }
}
