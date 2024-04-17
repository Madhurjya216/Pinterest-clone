const mongoose = require("mongoose");
const User = require('./users');

mongoose.connect(
  process.env.MONGOURI
);

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String,
  link: String,
  title: String,
  category: String,
});

module.exports = mongoose.model("Post", postSchema);
