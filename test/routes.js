//During the test the env variable is set to test
process.env.NODE_ENV = "test";

// let mongoose = require("mongoose");
// let Book = require("../app/models/book");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../index");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Users", () => {
  /*
   * Test the /GET user with id route
   */
  describe("/GET user details", () => {
    it("it should GET the user", (done) => {
      chai
        .request(app)
        .get("/api/user/63cbd686-747a-4647-bd88-79efab20cb52")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST book", () => {
    it("it should create a test user in the database", (done) => {
      const uuid = require("uuid");
      const id = uuid.v4();

      let data = {
        username: "test-user",
        name: "test",
      };
      chai
        .request(app)
        .post("/api/user/" + id)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  // describe("/GET a file", () => {
  //   it("it should GET a file", (done) => {
  //     chai
  //       .request(app)
  //       .get("/api/file/a32dde30-68bf-4da4-9cf1-44161f5d5d90")
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       });
  //   });

  //   after(() => {
  //     app.close();
  //   });
  // });
});
