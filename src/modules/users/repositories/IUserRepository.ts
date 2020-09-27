import ICreateUserDto from '../dtos/ICreateUserDto';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDto): Promise<User>;
  save(user: User): Promise<User>;
}
