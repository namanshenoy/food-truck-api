process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : auth', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  })
})

describe('GET /auth/register', () => {
  it('should render register view', (done) => {
    chai.request(server)
      .get('/auth/register')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('text/html');
        res.text.should.contain('<h1>Register</h1>');
        done();
      });
  });
});

describe('POST /auth/register', () => {
  it('should register a new user', (done) => {
    chai.request(server)
      .post('/auth/register')
      .send({
        username: 'user',
        password: 'password'
      })
      .end((err, res) => {
        should.not.exist(err);
        if (err) {
          console.error('Error in POST /auth/register')
          console.error(err)
        }
        done();
      });
  });
});

describe('GET /auth/login', () => {
  it('should render the login view', (done) => {
    chai.request(server)
      .get('/auth/login')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('text/html');
        res.text.should.contain('<h1>Login</h1>');
        done();
      });
  });
});

describe('POST /auth/login', () => {
  it('should login a user', (done) => {
    chai.request(server)
      .post('/auth/login')
      .send({
        username: 'username',
        password: 'password'
      })
      .end((err, res) => {
        done();
      })
  })
})