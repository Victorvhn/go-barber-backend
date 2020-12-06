import { v4 as uuid } from 'uuid';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const name = 'John Trê';
    const email = 'johntre@example.com';

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name,
      email,
    });

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.name).toBe(name);
    expect(updatedUser.email).toBe(email);
  });

  it('should not be able to change to another user email', async () => {
    const email = 'johndoe@example.com';

    await fakeUserRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    const user = await fakeUserRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Qualquer',
        email,
      }),
    ).rejects.toStrictEqual(new AppError('E-mail already in use.', 400));
  });

  it('should be able to update the password', async () => {
    const name = 'John Trê';
    const email = 'johntre@example.com';
    const oldPassword = '123456';
    const password = '1234567';

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: oldPassword,
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name,
      email,
      oldPassword,
      password,
    });

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.name).toBe(name);
    expect(updatedUser.email).toBe(email);
    expect(updatedUser.password).toBe(password);
  });

  it('should not be able to update the password without old password', async () => {
    const name = 'John Trê';
    const email = 'johntre@example.com';
    const oldPassword = '123456';
    const password = '1234567';

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: oldPassword,
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name,
        email,
        password,
      }),
    ).rejects.toStrictEqual(
      new AppError(
        'You need to inform the old password to set a new password.',
        400,
      ),
    );
  });

  it('should not be able to update the password with wrong old password', async () => {
    const name = 'John Trê';
    const email = 'johntre@example.com';

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name,
        email,
        oldPassword: 'wrong-old-password',
        password: '1234567',
      }),
    ).rejects.toStrictEqual(new AppError('Old password does not match.', 400));
  });

  it('should not be able update the profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        userId: uuid(),
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toStrictEqual(new AppError('User not found.', 400));
  });
});
