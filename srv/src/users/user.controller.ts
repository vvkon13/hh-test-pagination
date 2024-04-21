import { UserService } from './users.service';
import { Controller, Get, Logger } from '@nestjs/common';
import { UsersPaginatedResponseDto } from "./users.response.dto";
import { Query, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) { }

  @Get()
  async getAllUsers(
    @Query('take', ParseIntPipe) take?: number,
    @Query('page', ParseIntPipe) page?: number,
  ): Promise<UsersPaginatedResponseDto> { // Используем новый DTO в качестве типа возвращаемого значения
    take = take || 20;
    page = page || 1;
  
    this.logger.log(`Get all users with pagination take=${take}, page=${page}`);
  
    // Получаем пользователей и общее количество одновременно
    const [users, total] = await Promise.all([
      this.userService.findAll(take, page),
      this.userService.count()
    ]);
  
    // Используем метод fromUsersEntitiesAndPaginationInfo для создания DTO
    return UsersPaginatedResponseDto.fromUsersEntitiesAndPaginationInfo(users, total, page, take);
  }
}
