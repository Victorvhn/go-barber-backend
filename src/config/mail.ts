interface IMailConfig {
  driver: 'etherial' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'etherial',

  defaults: {
    from: {
      email: 'victor@victorvhn.dev',
      name: 'Victor Hugo do Nascimento',
    },
  },
} as IMailConfig;
