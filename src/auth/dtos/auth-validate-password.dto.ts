import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthValidatePasswordDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
