import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

class UsersController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { filename } = request.file;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: id,
      avatarFilename: filename,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete user.password;

    return response.json(user);
  }
}

export default UsersController;
