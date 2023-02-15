const nodemailer = require('nodemailer');

const config = require('./config');

const PREFIX = '[MMT]';

function sendMail(transport, to, subject, text) {
  if (!config.mailServiceConfigured) {
    return;
  }

  if (!to) {
    return;
  }

  transport.sendMail({
    from: config.mail.from,
    to,
    subject: `${PREFIX} ${subject}`,
    text,
  });
}

function emailService() {
  let mailTransport;

  if (config.mailServiceConfigured) {
    mailTransport = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
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

module.exports = emailService;
