/* eslint-env node, mongo */
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
  collectionTitle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  isVis: {
    type: Boolean,
    default: true
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