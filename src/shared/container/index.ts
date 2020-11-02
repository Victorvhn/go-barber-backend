import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository,
);
container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IUserTokensRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
