import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from 'src/auth/dtos';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async create(authDto: AuthDto): Promise<UserEntity> {
    const existingUser = await this.findOneByEmail(authDto.email);

    if (existingUser) return null;

    const hash = argon.hash(authDto.password);

    return await this.userRepository.save({
      email: authDto.email,
      password: hash,
      ...authDto,
    });
  }
}
