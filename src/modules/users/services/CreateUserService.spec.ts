import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
  });

  it('should not be able to create a users with the same email from another user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({ name, email, password });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);

    await expect(
      createUser.execute({ name, email, password }),
    ).rejects.toStrictEqual(new AppError('Email address already used.'));
  });
});
