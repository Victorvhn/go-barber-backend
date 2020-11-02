import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { v4 as uuid } from 'uuid';

import IUserTokensRepository from '../IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      userId,
    });

    this.userTokens.push(userToken);

    return userToken;
  }
}

export default FakeUserTokenRepository;
