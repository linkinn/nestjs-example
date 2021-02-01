import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO, AuthValidatePasswordDTO } from './dtos';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO);
  }

  async signIn(
    authValidatePasswordDTO: AuthValidatePasswordDTO,
  ): Promise<{ accessToken: string }> {
    const { username, email } = await this.userRepository.validateUserPassword(
      authValidatePasswordDTO,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username, email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
