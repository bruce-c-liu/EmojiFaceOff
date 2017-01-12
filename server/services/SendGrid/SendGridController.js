
const mailClient = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
module.exports = {

  emailFeedback: (req, res, next) => {
    let fromEmail = new mailClient.Email(req.body.email);
    let toEmail = new mailClient.Email('patrick@emojifaceoff.com');
    let subject = 'User Feedback';
    let content = new mailClient.Content('text/plain', `${req.body.name} has said: \n ${req.body.message}`);
    let mail = new mailClient.Mail(fromEmail, subject, toEmail, content);

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, (err, response) => {
      if (err) {
        res.json(err);
        throw err;
      } else {
        res.json(response.statusCode);
      }
    });
  }
};
