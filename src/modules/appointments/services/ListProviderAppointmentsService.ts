import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findAllInDayFromProvider(
      {
        providerId,
        day,
        month,
        year,
      },
    );

    await this.cacheProvider.save('asd', 'asd');

    return appointments;
  }
}

export default ListProviderAppointmentsService;
