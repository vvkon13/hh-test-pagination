import { UsersEntity } from "./users.entity";

export class UserResponseDto {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  updatedAt: Date;

  static fromUsersEntity(user: UsersEntity): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = user.id;
    dto.firstname = user.firstname;
    dto.lastname = user.lastname;
    dto.phone = user.phone;
    dto.email = user.email;
    dto.updatedAt = user.updatedAt;

    return dto;
  }
}

// Новый DTO для пагинации
export class UsersPaginatedResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  totalPages: number;

  static fromUsersEntitiesAndPaginationInfo(users: UsersEntity[], total: number, page: number, take: number): UsersPaginatedResponseDto {
    const dto = new UsersPaginatedResponseDto();

    dto.data = users.map(UserResponseDto.fromUsersEntity);
    dto.total = total;
    dto.page = page;
    dto.totalPages = Math.ceil(total / take);

    return dto;
  }
}
