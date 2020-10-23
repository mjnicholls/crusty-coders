const mongoose = require('mongoose');
var Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;
const UserSchema = new Schema({
  _id: String,
    email: {
        type: String,
        required: true
      },
      fullname: {
        type: String,
        required: true
      },
    username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema)

// logins: thunder@aol.com pass: thunderbird
// steve@aol.com / rejoinder