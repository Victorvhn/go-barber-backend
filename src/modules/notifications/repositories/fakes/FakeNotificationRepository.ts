import { ObjectID } from 'mongodb';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDto from '@modules/notifications/dtos/ICreateNotificationDto';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notifications';

class NotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  public async create({
    recipientId,
    content,
  }: ICreateNotificationDto): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), recipientId, content });

    this.notifications.push(notification);

    return notification;
  }
}

export default NotificationRepository;
