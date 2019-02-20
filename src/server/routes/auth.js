const Router = require('koa-router');
const passport = require('koa-passport');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const queries = require('../db/queries/users');

const router = new Router();

router
  .get('/auth/register', async (ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/register.html');
  });

router
  .post('/auth/register', async (ctx) => {
    const user = await queries.addUser(ctx.request.body);
    return passport.authenticate('local', (err, user, info, status) => {
      if (err) {
        console.error(err);
      }
      if (user) {
        // ctx.login(user);
        ctx.body = {
          status: 'success',
          registered: true
        }
        // ctx.redirect('/auth/status');
      } else {
        ctx.status = 400;
        ctx.body = {
          status: 'error',
          registered: false
        };
      }
    })(ctx);
  });

router
  .get(
    '/auth/status',
    passport.authenticate('jwt', {session: false}),
    async (ctx) => {
      console.log('user')
      // console.log(ctx)
      const { user } = ctx.req;
      console.log(user)
      if (ctx.isAuthenticated()) {
        ctx.body = {
          status: 'success',
          authenticated: true
        }
      } else {
        ctx.body = {
          status: 'success',
          authenticated: false
        }
      }
    }
  );

// router
//   .get('/auth/login', async (ctx) => {
//     if (!ctx.isAuthenticated()) {
//     } else {
//       ctx.redirect('/auth/status');
//     }
//   });

router
  .post('/auth/login', async (ctx) => {
    return passport.authenticate(
      'local',
      { session: false},
      (err, user, info, status) => {
        if (err) {
          console.error('Error in POST /auth/login')
          console.error(err);
          ctx.body = { status: 'error', err}
        }
        else if (user) {
          ctx.status = 200;
          const payload = {
            username: user.username,
            expires: Date.now() + 300000
          }
          ctx.login(payload, { session: false });
          const token = jwt.sign(JSON.stringify(payload), process.env.secret);
          ctx.body = { status: 'success', login: true, token }
          // ctx.body = { status: 'success', loggedIn: true };
        } else {
          ctx.status = 400;
          ctx.body = { status: 'error', loggedIn: false};
        }
      }
    )(ctx)
  })

router
  .get('/auth/logout', 
    passport.authenticate('jwt', {session: false}),
    async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.logout();
      ctx.body = {
        status: 'success',
        logout: true
      }
    } else {
      ctx.body = { success: false }
      ctx.throw(401);
    }
  })

module.exports = router;

