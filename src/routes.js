const router = require('koa-router')
const Account = require('./v1/controllers/account')

module.exports = {
  v1: function () {
    this.use(
      router()
        .get('/ping', function *(next) { this.body = 'pong!' })
        .post('/register', Account.register)
        .routes()
    )
    return this
  }
}
