import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDto from '@modules/notifications/dtos/ICreateNotificationDto';

import Notification from '../schemas/Notifications';

class NotificationRepository implements INotificationRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipientId,
    content,
  }: ICreateNotificationDto): Promise<Notification> {
    const notification = this.ormRepository.create({
      recipientId,
      content,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationRepository;
