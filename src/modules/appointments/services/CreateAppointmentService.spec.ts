import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });
  const providerId = '123456';
  const userId = '654321';

  it('should be able to create a new appointment', async () => {
    const date = startOfHour(new Date());

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
    const date = startOfHour(new Date(2020, 9, 27, 3, 39));

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
    ).rejects.toStrictEqual(new AppError('This appointment is already booked'));
  });
});
