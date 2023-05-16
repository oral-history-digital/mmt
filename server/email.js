import nodemailer from 'nodemailer';

import config from './config.js';

const PREFIX = '[MMT]';

function sendMail(transport, to, subject, text) {
  if (!config.mailServiceConfigured) {
    return;
  }

  if (!to) {
    return;
  }

  // TODO: This can crash! Errors need to be
  // caught in the future.
  transport.sendMail({
    from: config.mail.from,
    to,
    subject: `${PREFIX} ${subject}`,
    text,
  });
}

export default function emailService() {
  let mailTransport;

  if (config.mailServiceConfigured) {
    const options = {
      host: config.mail.host,
      port: config.mail.port,
    };
    if (config.mail.user && config.mail.pass) {
      options.auth = {
        user: config.mail.user,
        pass: config.mail.pass,
      };
    }
    mailTransport = nodemailer.createTransport(options);
  }

  return {
    sendMailToUser(to, subject, text) {
      sendMail(mailTransport, to, subject, text);
    },
    sendMailToSupport(subject, text) {
      sendMail(mailTransport, config.mail.supportAddress, subject, text);
    },
  };
}
