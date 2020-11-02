import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const email = 'johndoe@example.com';

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    const email = 'johndoe@example.com';

    await expect(
      sendForgotPasswordEmail.execute({
        email,
      }),
    ).rejects.toStrictEqual(new AppError('User does not exists.', 400));
  });

  it('should generate a forgot password token', async () => {
    const email = 'johndoe@example.com';

    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
