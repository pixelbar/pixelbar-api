const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const recaptchaValidator = require('recaptcha-validator')

module.exports = {
  register: function *() {
    this.validateBody('firstname').required('Firstname required').isString().isLength(1, 50).trim()
    this.validateBody('lastname').required('Lastname required').isString().isLength(1, 50).trim()
    this.validateBody('nickname').required('Nickname required').isString().isLength(1, 50).trim()
    this.validateBody('email').required('Email required').isEmail().isLength(1, 50).trim()
    this.validateBody('postal').required('Postal required').isString().isLength(1, 50).trim()
    this.validateBody('city').required('City required').isString().isLength(1, 50).trim()
    this.validateBody('address').required('Address required').isString().isLength(1, 50).trim()
    this.validateBody('phone').required('Phone required').isString().isLength(1, 50).trim()
    this.validateBody('age').required('Age required').isString().isLength(1, 50).trim()
    this.validateBody('membertype').required('Membertype required').isString().isLength(1, 50).trim()
    this.validateBody('g-recaptcha-response').required('reCaptcha response required').isString()

    var body = ''
    for (var key in this.vals) {
      if (key !== 'g-recaptcha-response') body += `<tr><td><b>${key}: </b></td><td>${this.vals[key]}</td><tr/>\n`
    }
    body += `<tr><td><b>IP: </b></td><td>${this.request.ip}</td><tr/>\n`

    try {
      yield recaptchaValidator.promise(process.env.CAPTCHA_SECRET, this.vals['g-recaptcha-response'], this.request.ip)

      var transporter = nodemailer.createTransport(
        smtpTransport({
          host: process.env.EMAIL_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })
      )

      transporter.sendMail({
        from: 'no-reply@pixelbar.nl',
        to: 'bestuur@pixelbar.nl',
        subject: 'New member signup',
        html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
              <meta name="viewport" content="width=device-width" />
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body>
              <p>Iemand heeft zich zojuist aangemeld via de website.</p>
              <table>
                ${body}
              </table>
            </body>
          </html>
        `
      })

      this.body = {status: 'ok'}
    } catch (ex) {
      this.status = 400
      this.body = {status: 'failed', message: 'Bad reCaptcha response'}
    }
  }
}
