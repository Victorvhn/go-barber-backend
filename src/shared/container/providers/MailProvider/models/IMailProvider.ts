import ISendMailDto from '../dtos/ISendMailDto';

export default interface IMailProvider {
  sendMail(data: ISendMailDto): Promise<void>;
}
