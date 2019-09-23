const mongoose = require('mongoose');

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
    maxlength: 100
  },
  vis: {
    type: Boolean,
    default: true
  },
  bookmarks: {
    type: Array
  }
},
  {
    collection: 'collections',
    timestamps: true
  }
);

module.exports = mongoose.model('Collection', collectionSchema);