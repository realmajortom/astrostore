const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length <= 40;
}

const collectionSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    maxlength: 24
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  vis: {
    type: Boolean,
    default: true
  },
  sequence: {
    type: Number,
    default: 1
  },
  bookmarks: {
    type: Array,
    validate: arrayLimit
  }
},
  {
    collection: 'collections',
    timestamps: true
  }
);

module.exports = mongoose.model('Collection', collectionSchema);