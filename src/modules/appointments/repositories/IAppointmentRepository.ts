import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDto from '../dtos/ICreateAppointmentDto';
import IFindAllInMonthFromProviderDto from '../dtos/FindAllInMonthFromProviderDto';
import IFindAllInDayFromProviderDto from '../dtos/IFindAllInDayFromProviderDto';

interface IAppointmentRepository {
  create(data: ICreateAppointmentDto): Promise<Appointment>;
  findByDate(date: Date, providerId: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDto,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDto,
  ): Promise<Appointment[]>;
}

export default IAppointmentRepository;
