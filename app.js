'use strict';

const
  Koa = require('koa'),
  app = new Koa(),
  port = 8080
  ;

app.use(require('koa-static-server')({ rootDir: 'public' }));

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
  console.log(`[${new Date()}] ${ctx.method} | ${ms.toFixed(3)}ms | ${ctx.url}`);
});

// Handle server errors
app.on('error', err => log.error('Server error', err));

// response
// app.use(ctx => {
//   ctx.body = 'Hello World';
// });

app.listen(port, () => {
  console.log(`Listening on ${port}`);

  const HSKChunk = require('./lib/hskparser.js');
  let hsk = new HSKChunk();
  hsk
    .parseLevel(1)
    .then(() => console.log(hsk.getRandomWord()));

});
