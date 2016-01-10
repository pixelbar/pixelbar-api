const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const etag = require('koa-etag')
const json = require('koa-json')
const bouncer = require('koa-bouncer')
const mount = require('koa-mount')
const cors = require('kcors')

const api = require('./routes')
const http = require('http')

var app = koa()
app.proxy = true

app.use(bodyParser())
app.use(etag())
app.use(json())
app.use(bouncer.middleware())
app.use(cors())

app.use(function *(next) {
  try {
    yield* next
  } catch (err) {
    if (err instanceof bouncer.ValidationError) {
      this.body = {message: err.message}
      this.status = 400
    }
  }
})

app.use(mount('/v1', api.v1.call(app)))
app = http.createServer(app.callback())

app.listen(process.env.PORT || 3000)
console.log(`$ open http://127.0.0.1:${process.env.PORT || 3000}`)
