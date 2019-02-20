const Router = require('koa-router');
const passport = require('koa-passport');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const queries = require('../db/queries/users');

const router = new Router();

router
  .get(
    '/user',
    passport.authenticate('jwt', {session: false}),
    async (ctx) => {
      // console.log('user')
      // console.log(ctx)
      const { user } = ctx.req;
      // console.log(user)
      if (ctx.isAuthenticated()) {
        const returnUser = await queries.getUser(user)
        ctx.body = {
          status: 'success',
          authenticated: true,
          user: returnUser
        }
      } else {
        ctx.body = {
          status: 'success',
          authenticated: false
        }
      }
    }
  );

module.exports = router;
