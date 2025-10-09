const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controllers/user.js");

router.route("/signup")
.get(userController.signUpForm)
.post(wrapAsync(userController.signedUp));

router.route("/login")
.get(userController.loginForm)
.post(
   saveRedirectUrl,
   passport.authenticate("local",
      {
         failureRedirect: '/login',
         failureFlash: true
      }),
  userController.loggedIn
);
router.get("/logout", userController.logOut)



// router.get("/signup", userController.signUpForm)
// router.post("/signup", wrapAsync(userController.signedUp));

// router.get("/login", userController.loginForm)

// router.post("/login",saveRedirectUrl,
//    passport.authenticate("local",
//       {
//          failureRedirect: '/login',
//          failureFlash: true
//       }),
//   userController.loggedIn
// )

// router.get("/logout", userController.logOut)

module.exports = router;