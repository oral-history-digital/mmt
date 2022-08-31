const nodemailer = require('nodemailer');

function emailService(credentials) {
    const mailTransport = nodemailer.createTransport({
        host: credentials.mail.host,
        port: credentials.mail.port,
        auth: {
            user: credentials.mail.user,
            pass: credentials.mail.password,
        },
    });

    const from = '"OHD" <ohd@example.com>';

    return {
        send: function(to, subject, text) {
            mailTransport.sendMail({
                from,
                to,
                subject,
                text,
            });
        },
    };
}

module.exports = emailService;
