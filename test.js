var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

//need to have an empty database before testing starts
//it will start with a post to create the data, then get --> put --> delete data.
//the file name gets a number based on amount of files, so there needs to be 0 so that the count starts at the correct index

describe('get home directory', function() {
  it('should recieve a succss message on request', function(done) {
    chai.request('http://localhost:8888')
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.eql('get request to home directory worked');
          done();
    });
  });
});


describe('post route', function() {
  it('should post file' , function(done) {
    chai.request('http://localhost:8888')
        .post('/')
        .send({"firstName": "Bob", "email": "bob@gmail.com", "powerLevel":"9001" })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.eql('File Received');
          done();
    });
  });
});

describe('get route', function() {
  it('should get file from the post test', function(done) {
    chai.request('http://localhost:8888')
        .get("/1-Bob")
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.eql('{"firstName":"Bob","email":"bob@gmail.com","powerLevel":"9001"}');
          done();
        });
  });
});

describe('put route', function() {
  it('should put file' , function(done) {
    chai.request('http://localhost:8888')
        .put('/1-Bob')
        .send( {"powerLevel":"20"})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.eql('File updated');
          done();
        });
  });
});

describe('delete route', function() {
  it('should delete file', function(done) {
    chai.request('http://localhost:8888')
        .delete('/1-Bob')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.eql('1-Bob has been deleted');
          done();
        });
  });
});
