const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const Post = require("./post");

mongoose.connect(process.env.MONGOURI);

const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  email: String,
  password: String,
  profileImg: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
    },
  ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
