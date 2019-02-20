const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const RedisStore = require('koa-redis');

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const app = new Koa();

// app.use(cors({
//   origin: '*',
//   credentials: true
// }));

const PORT = process.env.PORT || 1337;

// sessions
console.log(process.env.secret)
app.keys = [process.env.secret];
app.use(session({
  store: new RedisStore()
}, app));

// body parser
app.use(bodyParser());

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(indexRoutes.routes());
app.use(movieRoutes.routes());
app.use(authRoutes.routes());

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
