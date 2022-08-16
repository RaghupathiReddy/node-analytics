var config = require('../../config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sgMailAPIKey);

const sendEmail = async (email, subject, text) => {
    const msg = {
        to: email,
        from: config.mailSenderAddress,
        subject: subject,
        text: text,
    }
    return await sgMail.send(msg)
        .then((response) => {
            return true;
        })
        .catch((error) => {
            return error;
        })
};

module.exports = sendEmail;