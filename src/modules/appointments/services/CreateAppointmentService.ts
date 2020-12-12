import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  userId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
  ) {}

  public async execute({
    providerId,
    userId,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (userId === providerId) {
      throw new AppError(
        "You cant't create an appointment with your self",
        400,
      );
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError(
        "You cant't create an appointment on a past date",
        400,
      );
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointment between 8am and 5pm',
        400,
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      userId,
      date: appointmentDate,
    });

    const formattedDate = format(date, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationRepository.create({
      recipientId: providerId,
      content: `Novo agendamento para dia ${formattedDate}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
