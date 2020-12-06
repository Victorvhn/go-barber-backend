import { v4 as uuid } from 'uuid';

import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    showProfile = new ShowProfileService(fakeUserRepository);
  });

  it('should be able show the profile', async () => {
    const persistedUser = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await showProfile.execute({ userId: persistedUser.id });

    expect(user).toBe(persistedUser);
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        userId: uuid(),
      }),
    ).rejects.toStrictEqual(new AppError('User not found.', 400));
  });
});
