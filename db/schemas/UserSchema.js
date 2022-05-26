const dynamoose = require("dynamoose");

module.exports = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    default: "",
  },
  files: {
    type: Array,
    schema: [String],
    default: [],
  },
});
