const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const PassportJWT = require('passport-jwt');
const JwtStrategy = PassportJWT.Strategy;
const ExtractJwt = PassportJWT.ExtractJwt;

const knex = require('./db/connection');

const bcrypt = require('bcryptjs');

const options = {};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return knex('users')
          .where({ id })
          .first()
          .then((user) => {
            done(null, user);
          })
          .catch((err) => {
            done(err, user);
          });
});

passport.use(
  new LocalStrategy(
    options,
    (username, password, done) => {
      knex('users')
        .where({ username })
        .first()
        .then((user) => {
          if (!user) return done(null, false);
          if (!comparePassword(password, user.password)) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          console.error('Error in passport.use');
          console.error(err);
          return done(err);
        });
    }
  )
);

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

options.secretOrKey = process.env.secret;

passport.use(
  new JwtStrategy(
    options,
    (jwt_payload, done) => {
      if (Date.now() > jwt_payload.expires) {
        return done('jwt expired')
      }
      console.log('Authenticated!')
      console.log(jwt_payload)
      return done(null, jwt_payload.username)
    }
  )
);

function comparePassword (userPassword, storedPassword) {
  return bcrypt.compareSync(userPassword, storedPassword);
}
