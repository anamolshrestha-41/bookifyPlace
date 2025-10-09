const Listing= require('./models/listing')
const ExpressError=require("./utils/ExpressError.js");
const {ListingSchema, reviewSchema}=require("./schema.js");
const Review= require("./models/review")

module.exports.isLoggedIn=(req, res, next)=>{
        if(!req.isAuthenticated()){
            
            // redirectURL
            req.session.redirectUrl= req.originalUrl;
        req.flash("error", "you must be logged-in");
        res.redirect("/login");
    }
    next(); 
}

module.exports.saveRedirectUrl= (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
   let {id}= req.params;
    let listing= await Listing.findById(id);
if(!currentUser && listing.owner.equals._id(res.locals.currentUser._id)){
    req.flash("error", "You dont have permission foe edition.");
 return   res.redirect(`/listings/${id}`);
}
next();
}

module.exports.validateListing=(req, res, next)=>{
 let {error}=ListingSchema.validate(req.body);
 if(error) {
    let errMsg= error.details.map ((element)=>element.message).join(",");
    throw new ExpressError(404, error);
 }  
 else{
    next();
 }
}

module.exports.validateReview=(req, res, next)=>{
 let {error}=reviewSchema.validate(req.body);
 if(error) {
    let errMsg= error.details.map ((element)=>element.message).join(",");
    throw new ExpressError(404, error);
 }  
 else{
    next();
 }
}
module.exports.isReviewPerson= async(req,res,next)=>{
   let {id, reviewId}= req.params;
    let review= await Review.findById(reviewId);
if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", "You dont have permission foe edition.");
 return   res.redirect(`/listings/${id}`);
}
next();
}