import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserId } from 'src/auth/decorators/user-id/user-id.decorator';

@ApiTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateTodoDto) {
    return this.todoService.create(userId, dto);
  }

  @Get()
  findAll(@UserId() userId: number) {
    return this.todoService.findAll(userId);
  }

  @Patch(':id')
  update(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todoService.update(userId, Number(id), dto);
  }

  @Delete(':id')
  remove(@UserId() userId: number, @Param('id') id: string) {
    return this.todoService.remove(userId, Number(id));
  }
}
