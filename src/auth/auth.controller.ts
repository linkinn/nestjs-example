import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidatePasswordDTO, AuthCredentialsDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authValidatePasswordDTO: AuthValidatePasswordDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authValidatePasswordDTO);
  }
}
