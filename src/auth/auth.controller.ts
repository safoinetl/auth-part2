import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { authCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup') // request to make an account
  signUp(@Body() authCredentialsDto: authCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin') // request to enter that account
  signIn(
    @Body() authCredentialsDto: authCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signin(authCredentialsDto);
  }


  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req){
    console.log(req);
  }

}
