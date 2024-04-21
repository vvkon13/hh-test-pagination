import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get a list of all users of 20 people 
  async findAll(take: number = 20, page: number = 1): Promise<UsersEntity[]> {
    const skip = take * (page - 1);
    return await this.usersRepo.find({
      take: take,
      skip: skip,
    });
  }

  async count(): Promise<number> {
    return await this.usersRepo.count();
  }
  
  
}
