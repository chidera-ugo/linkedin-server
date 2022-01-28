import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async hashData(data: string) {
    return await argon.hash(data);
  }

  async validateUser(authDto: AuthDto): Promise<any> {
    const user = await this.findOneByEmail(authDto.email);

    if (!user)
      throw new ForbiddenException('Invalid email/password combination');

    const validPassword = await argon.verify(user.password, authDto.password);

    if (!validPassword)
      throw new ForbiddenException('Invalid email/password combination');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async create(authDto: AuthDto): Promise<UserEntity> {
    const existingUser = await this.findOneByEmail(authDto.email);

    if (existingUser)
      throw new ForbiddenException('Invalid email/password combination');

    const hash = await this.hashData(authDto.password);

    return await this.userRepository.save({
      ...authDto,
      email: authDto.email,
      password: hash,
    });
  }

  async updateRefreshToken(refreshToken: string, id: string) {
    const hash = await this.hashData(refreshToken);
    await this.userRepository.update(id, { refresh_token: hash });
  }
}
