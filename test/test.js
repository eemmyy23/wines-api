require('dotenv').config({path: '.env.test'});
require('dotenv').config();
/* eslint-disable vars-on-top */
var chai = require('chai');

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable no-unused-vars */

chai.use(require('chai-http'));

let MongoClient = require('mongodb').MongoClient;
var server = chai.request(process.env.TEST_SERVER_URL);
var wines = require('./testData/wines');

describe('DEVELOPER CHALLENGE', () => {
  describe('API WINES', () => {

    before('drop wines collection', () =>
      MongoClient.connect(process.env.MONGO_URL)
      .then(db => {
        db.dropCollection('wines');
        db.dropCollection('counters');
      })
    );

    it('should return an empty array on GET /wines', () =>
      server
      .get('/wines')
      .then( res => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.lengthOf(0);
      })
    );

    it('should create new wine on POST /wines', () =>
      server
      .post('/wines')
      .send(wines.post)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.deep.equal(wines.post);
      })
    );

    it('should list filered wines on GET /wines?filter1=value', () =>
      server
      .get('/wines?year=2013&type=red')
      .then( res => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.lengthOf(1);
        res.body[0].year.should.equal(2013);
        res.body[0].type.should.equal('red');
      })
    );

    it('should return validation error on POST /wines', () =>
      server
      .post('/wines')
      .send(wines.postErr)
      .catch(err => {
        err.should.have.status(400);
        err.response.res.body.should.be.an('object');
        err.response.res.body.should.deep.equal(wines.postErrRes);
      })
    );

    it('should update the wine on PUT /wines/:id', () =>
      server
      .put('/wines/1')
      .send(wines.put)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.deep.equal(Object.assign(wines.post, wines.put));
      })
    );

    it('should return unknown error PUT /wines/:id', () =>
      server
      .put('/wines/2')
      .send(wines.put)
      .catch(err => {
        err.should.have.status(400);
        err.response.res.body.should.be.an('object');
        err.response.res.body.should.deep.equal(wines.unknownErrRes);
      })
    );

    it('should retrive a wine on GET /wines/:id', () =>
      server
      .get('/wines/1')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.deep.equal(Object.assign(wines.post, wines.put));
      })
    );

    it('should delete a wine on DELETE /wines/:id', () =>
      server
      .del('/wines/1')
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.deep.equal(wines.successRes);
      })
    );
  });

  it('should return unknown on DELETE /wines/:id', () =>
    server
    .del('/wines/1')
    .catch(err => {
      err.should.have.status(400);
      err.response.res.body.should.be.an('object');
      err.response.res.body.should.deep.equal(wines.unknownErrRes);
    })
  );

});
