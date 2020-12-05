import nomemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

export default class EtherialMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nomemailer.createTestAccount().then(account => {
      const transporter = nomemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail(to: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      from: 'Equipe GoBarber <equipe@gobarber.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
    });

    console.log('Meesage sent: %s', message.messageId);
    console.log('Preview URL: %s', nomemailer.getTestMessageUrl(message));
  }
}
