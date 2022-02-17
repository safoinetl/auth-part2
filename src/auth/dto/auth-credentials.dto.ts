import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class authCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  username: string;
//making a condition thats make the password more powerfull 
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `password is too weak`,
  })
  password: string;
}
