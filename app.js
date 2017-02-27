'use strict';

const
  Koa = require('koa'),
  KoaRouter = require('koa-router'),
  BodyParser = require('koa-bodyparser'),
  app = new Koa(),
  router = KoaRouter(),
  port = 8080
  ;

// HSK handling
const HSKChunk = require('./lib/hskparser.js');
let hsk = new HSKChunk();

// x-response-time
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`[${new Date()}] ${ctx.method} | ${ms}ms | ${ctx.url}`);
});

router
  .get('/word', function *() {
    this.body = hsk.getRandomWord();
  })
  .post('/level', function *() {
    let level = this.request.body.level || NaN;
    if (!isNaN(level)) {
      yield hsk.parseLevel(level);
      this.body = {"status": "OK"};
    }
  })
;

app
  .use(require('koa-static-server')({ rootDir: 'public' }))
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
;

// Handle server errors
app.on('error', err => log.error('Server error', err));

hsk.parseLevel(1).then(() => {
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
});
