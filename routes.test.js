//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let Book = require("../app/models/book");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("./index");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Books", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Book.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("/GET user details", () => {
    it("it should GET the user", (done) => {
      chai
        .request(app)
        .get("/api/user/63cbd686-747a-4647-bd88-79efab20cb52")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
