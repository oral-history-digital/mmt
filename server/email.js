const nodemailer = require('nodemailer');

const config = require('./config');

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
        send: function(to, subject, text) {
            if (!config.mailServiceConfigured) {
                return;
            }

            mailTransport.sendMail({
                from: config.mail.from,
                to,
                subject,
                text
            });
        }
    };
}

module.exports = emailService;
