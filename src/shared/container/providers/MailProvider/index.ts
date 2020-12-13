import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import EtherialMailProvider from './implementations/EtherealMailProvider';
import SesMailProvider from './implementations/SesMailProvider';
import IMailProvider from './models/IMailProvider';

const providers = {
  etherial: container.resolve(EtherialMailProvider),
  ses: container.resolve(SesMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
