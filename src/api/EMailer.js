//EMailer.js//
const nodeMailer = require('nodemailer');

class EMailer{
    constructor(config, client) {
        this.config = config;
        this.client = client;
    }
    connection() {
        return nodeMailer.createTransport({
            service: this.config.email.service,
            auth: {
                user: this.config.email.user,
                pass: this.config.email.password
            }
        });
    }
    emailing(email, word) {
        let mailOptions = {
            from: this.config.email.user,
            to: email,
            subject: `By ${this.client.user.username} From a special quest!`,
            text: word
        };

        this.connection().sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = {
    EMailer
}
