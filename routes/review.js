const express= require("express");
const router= express.Router({
    mergeParams: true
});
const Review= require("../models/review")
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js")
const Listing= require("../models/listing.js");
const { validateReview, isLoggedIn, isOwner, isReviewPerson } = require("../middleware.js");
const reviewController= require("../controllers/reviews.js")



//REVIEWS
//Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))
 
//delete review
router.delete("/:reviewId",isLoggedIn, isReviewPerson, wrapAsync(reviewController.deleteReview))

module.exports=router;