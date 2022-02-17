import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: authCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signin(
    authCredentialsDto: authCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password,
      )) /* it will do a comparation between your input and the base de donnees if its true it will return a succed message else it throw an error */
    ) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your information');
    }
  }
}
