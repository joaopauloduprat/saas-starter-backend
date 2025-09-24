import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { LoginUserDto } from './loginUser.dto';

export class SignupUserDto extends LoginUserDto {
  @ApiProperty()
  @IsString()
  name: string;
}
