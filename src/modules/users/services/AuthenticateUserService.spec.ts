import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const response = await authenticateUser.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    expect(
      authenticateUser.execute({
        email: 'johndoe2@example.com',
        password: '123',
      }),
    ).rejects.toStrictEqual(
      new AppError('Incorrect email/password combination.', 401),
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name,
      email,
      password,
    });

    expect(
      authenticateUser.execute({
        email,
        password: '12345',
      }),
    ).rejects.toStrictEqual(
      new AppError('Incorrect email/password combination.', 401),
    );
  });
});
