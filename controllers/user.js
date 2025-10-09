const User = require("../models/user.js");

module.exports.signUpForm=(req, res) => {
   res.render("users/signup.ejs")
};


module.exports.signedUp=async (req, res) => {
   try {
      let { username, email, password } = req.body
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
         if (err) {
            next(err);
         }
         req.flash("success", "Welcome To WanderLust");
         res.redirect("/listings");
      })
      //  req.flash("success", "Welcome To WanderLust");
      //  res.redirect("/listings");
   }
   catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
   }
}

module.exports.loginForm=(req, res) => {
   res.render("users/login.ejs")
}

module.exports.loggedIn= async (req, res) => {
      req.flash("success", "Welcome to your world.")
      //  res.redirect("/listings");
      let redirectUrl= res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
   };


   module.exports.logOut=(req, res) => {
   req.logout((err) => {
      if (err) {
         return next(err);
      }
      req.flash("success", "logged out");
      res.redirect("/listings");
   })
};