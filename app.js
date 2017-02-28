'use strict';

const
  Koa = require('koa'),
  KoaRouter = require('koa-router'),
  BodyParser = require('koa-bodyparser'),
  app = new Koa(),
  router = KoaRouter()
  ;

// HSK handling
const HSKChunk = require('./lib/hskparser.js');
let hsks = [];

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
  .get('/word/:level', function *() {
    this.body = hsks[this.params.level-1].getRandomWord();
  })
  .get('/word/:level/:index', function *() {
    this.body = hsks[this.params.level-1].getWordByFreq(this.params.index);
  })
  // .post('/level', function *() {
  //   let level = this.request.body.level || NaN;
  //   if (!isNaN(level)) {
  //     yield hsk.parseLevel(level);
  //     this.body = {"status": "OK"};
  //   }
  // })
;

app
  .use(require('koa-static-server')({ rootDir: 'public' }))
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
;

// Handle server errors
app.on('error', err => log.error('Server error', err));

function *genHsk() {
  let lvl = 1;
  while (lvl < 7) {
    hsks.push(new HSKChunk());
    yield hsks[lvl-1].parseLevel(lvl);
    lvl++;
  }
}

function createInit() {
  let gen = genHsk();
  let initRoutines = [];
  let iter;
  do {
    iter = gen.next();
    if (!iter.done) {
      initRoutines.push(iter.value);
    }
  } while (!iter.done);

  return initRoutines;
}

Promise.all(createInit()).then(values => {
  hsks = values;
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`Listening on ${port}`);
  });
});
