import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });
  const providerId = '123456';
  const userId = '654321';

  it('should be able to create a new appointment', async () => {
    const mockDate = new Date(2020, 4, 10, 12);
    const date = startOfHour(new Date(2020, 4, 10, 13));

    jest.spyOn(Date, 'now').mockImplementationOnce(() => mockDate.getTime());

    const appointment = await createAppointment.execute({
      date,
      userId,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toStrictEqual(date);
    expect(appointment.providerId).toBe(providerId);
    expect(appointment.userId).toBe(userId);
  });

  it('should not be able to create two appointment on the same time', async () => {
    const date = startOfHour(new Date(2020, 9, 27, 10, 39));

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 9, 27, 9, 39).getTime());

    const appointment = await createAppointment.execute({
      date,
      userId,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toStrictEqual(date);
    expect(appointment.providerId).toBe(providerId);
    expect(appointment.userId).toBe(userId);

    await expect(
      createAppointment.execute({
        date,
        userId,
        providerId,
      }),
    ).rejects.toStrictEqual(
      new AppError('This appointment is already booked', 400),
    );
  });

  it('should not be able to create an appointment on a past date', async () => {
    const oldDate = new Date(2020, 4, 10, 12, 30);
    const date = startOfHour(oldDate);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => oldDate.getTime());

    await expect(
      createAppointment.execute({
        providerId,
        userId,
        date,
      }),
    ).rejects.toStrictEqual(
      new AppError("You cant't create an appointment on a past date", 400),
    );
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    const oldDate = new Date(2020, 4, 10, 12, 30);
    const date = startOfHour(oldDate);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => oldDate.getTime());

    await expect(
      createAppointment.execute({
        providerId,
        userId: providerId,
        date,
      }),
    ).rejects.toStrictEqual(
      new AppError("You cant't create an appointment with your self", 400),
    );
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        providerId,
        userId,
        date: new Date(2020, 4, 12, 7),
      }),
    ).rejects.toStrictEqual(
      new AppError('You can only create appointment between 8am and 5pm', 400),
    );

    await expect(
      createAppointment.execute({
        providerId,
        userId,
        date: new Date(2020, 4, 12, 18),
      }),
    ).rejects.toStrictEqual(
      new AppError('You can only create appointment between 8am and 5pm', 400),
    );
  });
});
