const express= require("express");
const router= express.Router({
    mergeParams: true
});
const Review= require("../models/review")
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js")
const { reviewSchema}=require("../schema.js");
const Listing= require("../models/listing.js")


const validateReview=(req, res, next)=>{
 let {error}=reviewSchema.validate(req.body);
 if(error) {
    let errMsg= error.details.map ((element)=>element.message).join(",");
    throw new ExpressError(404, error);
 }  
 else{
    next();
 }
}



//REVIEWS
//Post route
router.post("/", validateReview, wrapAsync(async(req, res)=>{
let listing= await Listing.findById(req.params.id);
let newReview= new Review(req.body.review);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
res.redirect(`/listings/${listing._id}`); 
}))
 
//delete review
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

module.exports=router;