const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100
  },
  url: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 500
  },
  parentId: {
    type: String,
    required: true,
    maxLength: 24
  },
  isFave: {type: Boolean, default: false},
  addDate: Number
},
  {timestamps: true}
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);