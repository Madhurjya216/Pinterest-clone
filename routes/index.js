var express = require("express");
var router = express.Router();
const UserData = require("./users");
const passport = require("passport");
const pl = require("passport-local");
const multer = require("multer");
const PostData = require("./post");
passport.use(new pl(UserData.authenticate()));

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});
const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/home", async (req, res) => {
  try {
    const posts = await PostData.find({});
    res.render("home", { posts });
  } catch (error) {
    console.log(`Error >>> ${error}`);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/profile", isLoggIn, async (req, res) => {
  const user = await UserData.findOne({
    username: req.session.passport.user,
  }).populate("posts");
  res.render("profile", { user });
});

router.get("/save", function (req, res) {
  res.render("save");
});

router.get("/create", function (req, res) {
  res.render("create");
});

router.get("/explore", async (req, res) => {
  try {
    const PostCategory = await PostData.distinct("category");
    res.render("explore", { PostCategory });
  } catch (error) {
    console.log(`Error >>> ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/explore/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const posts = await PostData.find({ category });
    res.render("categoryPost", { category, posts });
  } catch (error) {
    console.log(`Error >>> ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/profilePic",
  isLoggIn,
  upload.single("profile-Pic"),
  async (req, res) => {
    try {
      const user = await UserData.findOne({
        username: req.session.passport.user,
      });
      user.profileImg = req.file.filename;
      await user.save();
      res.redirect("/profile");
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }
);

router.post(
  "/createPost",
  isLoggIn,
  upload.single("newPost"),
  async (req, res) => {
    try {
      const user = await UserData.findOne({
        username: req.session.passport.user,
      });
      const post = await PostData.create({
        user: user._id,
        image: req.file.filename,
        link: req.body.link,
        title: req.body.title,
        category: req.body.category,
      });

      user.posts.push(post._id);

      await user.save();

      res.redirect("/home");
    } catch (error) {
      console.log(`Error >>> ${error}`);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/signup", function (req, res) {
  const data = new UserData({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email, 
  });

  UserData.register(data, req.body.password).then(function (registeredUser) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/home");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  })
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

function isLoggIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;