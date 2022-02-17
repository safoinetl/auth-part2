import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {
    super({
      secretOrKey: 'topsecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(Payload: JwtPayload): Promise<User> {
    const { username } = Payload;
    const user: User = await this.usersRepository.findOne({ username });
    if (!user){
      throw new UnauthorizedException();
    } else {
      return user;
    }
  } 
}
