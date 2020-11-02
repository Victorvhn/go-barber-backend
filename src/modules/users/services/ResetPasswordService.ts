import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokensRepository,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists.');
    }

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    user.password = password;

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
