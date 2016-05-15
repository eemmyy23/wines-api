var supertest = require('supertest');
var server = supertest.agent('http://localhost:8080');
require('should');


describe('SAMPLE unit test', function() {
  it('should be running', function(done) {
    server
    .get('/wines')
    .expect('Content-type', /json/)
    .expect(200) // THis is HTTP response
    .end(function(err, res) {
      res.status.should.equal(200);
      done();
    });
  });
  it('should list ALL wines on GET /wines');
  it('should create new wine on POST /wines');
  it('should update the wine on PUT /wines/:id');
  it('should retrive a wine on GET /wines/:id');
  it('should delete a wine on DELETE /wines/:id');
});
