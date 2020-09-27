import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const date = startOfHour(new Date());
    const providerId = '123456';

    const fakeAppointmentRepository = new FakeAppointmentRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      date,
      providerId,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toStrictEqual(date);
    expect(appointment.providerId).toBe(providerId);
  });

  it('should not be able to create two appointment on the sema time', async () => {
    const date = startOfHour(new Date(2020, 9, 27, 3, 39));
    const providerId = '123456';

    const fakeAppointmentRepository = new FakeAppointmentRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      date,
      providerId,
    });

    expect(
      createAppointment.execute({
        date,
        providerId,
      }),
    ).rejects.toStrictEqual(new AppError('This appointment is already booked'));

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toStrictEqual(date);
    expect(appointment.providerId).toBe(providerId);
  });
});
