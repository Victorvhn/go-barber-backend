import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
    const avatarFilename = 'avatar.jpg';

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedAvatarUser = await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename,
    });

    expect(updatedAvatarUser.avatar).toBe(avatarFilename);
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        userId: 'non-existing-user',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toStrictEqual(
      new AppError('Only autheticated users can change avatar.', 401),
    );
  });

  it('should delete old avatar when updating new one', async () => {
    const oldAvatarFilename = 'avatar1.jpg';
    const newAvatarFilename = 'avatar2.jpg';

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: oldAvatarFilename,
    });

    const updatedAvatarUser = await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: newAvatarFilename,
    });

    expect(deleteFile).toHaveBeenCalledWith(oldAvatarFilename);

    expect(updatedAvatarUser.avatar).toBe(newAvatarFilename);
  });
});
