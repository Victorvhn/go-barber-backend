import { v4 as uuid } from 'uuid';
import { isEqual } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async create({
    providerId,
    date,
  }: ICreateAppointmentDto): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, providerId });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
  }
}

export default AppointmentRepository;
