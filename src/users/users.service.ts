import { ConflictException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { hashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './users.dto';
import { UsersEntity } from 'src/db/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}
  async create(user: UserDto) {
    const alreadyExists = await this.usersRepository.findOne({
      where: { username: user.username },
    });
    if (alreadyExists) {
      throw new ConflictException('User already registered');
    }
    const dbUser = new UsersEntity();
    dbUser.id = uuid();
    dbUser.username = user.username;
    dbUser.passwordHash = hashSync(user.password, 10);

    const { id, username } = await this.usersRepository.save(dbUser);

    return {
      id,
      username,
    };
  }
  async findByUsername(username: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      return null;
    }
    return {
      id: user.id,
      username: user.username,
      password: user.passwordHash,
    };
  }
}
