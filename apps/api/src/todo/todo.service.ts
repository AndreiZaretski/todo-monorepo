import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Prisma } from 'db';
import { TRPCError } from '@trpc/server';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateTodoDto) {
    try {
      return await this.prisma.todo.create({
        data: {
          text: dto.text,
          userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // throw new BadRequestException(`Задача "${dto.text}" ужесуществует `);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Задача "${dto.text}" уже существует`,
        });
      }
      throw error;
    }
  }

  async findAll(userId: number) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  async update(userId: number, id: number, dto: UpdateTodoDto) {
    try {
      return await this.prisma.todo.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // throw new BadRequestException(`Задача "${dto.text}" уже существует`);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Задача "${dto.text}" уже существует`,
        });
      }
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    try {
      return await this.prisma.todo.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Задача с id ${id} не найдено`,
        });
        // throw new BadRequestException(`Задание с id ${id} не найдено`);
      }
      throw error;
    }
  }
}
