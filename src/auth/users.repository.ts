import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { authCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: authCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    //hashin the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      //it gonna throw an error if find any mistake or a conflict = duplicate username
      if (error.code === '23505') {
        throw new ConflictException('username already exist ');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
