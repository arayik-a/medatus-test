import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';

export class LoginDTO {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
