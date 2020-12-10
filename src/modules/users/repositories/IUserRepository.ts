import IFindAllProvidersDto from '@modules/appointments/dtos/IFindAllProvidersDto';
import ICreateUserDto from '../dtos/ICreateUserDto';

import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  findAllProviders(dto: IFindAllProvidersDto): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDto): Promise<User>;
  save(user: User): Promise<User>;
}
