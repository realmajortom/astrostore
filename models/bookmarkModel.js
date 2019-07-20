// flex
const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  bookmarkTitle: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50
  },
  bookmarkUrl: {
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
  bookmarkFav: {type: Boolean, default: false},
  bookmarkMakeDate: Number
},
  {timestamps: true}
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);