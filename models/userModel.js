/* eslint-env node, mongo */
const mongoose = require('mongoose');

function safety(val) {
  return !(/[^\w\d]/i.test(val));
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxLength: 30,
    validate: [safety, 'Username cannot contain symbols']
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 30
  }
},
  {
    collection: 'users',
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
