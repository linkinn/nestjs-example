import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDTO, AuthValidatePasswordDTO } from './dtos';
import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: AuthCredentialsDTO) {
    const { username, email, password } = authCredentialsDTO;

    const emailExists = await this.findOne({ email });
    const usernameExists = await this.findOne({ username });

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    if (usernameExists) {
      throw new ConflictException('Username alread exists');
    }

    const user = new User();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authValidatePasswordDTO: AuthValidatePasswordDTO,
  ): Promise<JwtPayload> {
    const { email, password } = authValidatePasswordDTO;
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return { username: user.username, email };
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
