import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = container.resolve(AuthenticateUserService);

  const { user, token } = await authenticateUser.execute({ email, password });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
