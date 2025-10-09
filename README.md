WanderLust Project.


``listing.js Routes``
```
const express= require("express");
const router= express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const Listing= require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing }= require("../middleware.js")
const listingController= require("../controllers/listings.js")
// const validateListing=(req, res, next)=>{
//  let {error}=ListingSchema.validate(req.body);
//  if(error) {
//     let errMsg= error.details.map ((element)=>element.message).join(",");
//     throw new ExpressError(404, error);
//  }  
//  else{
//     next();
//  }
// }

//checking..
// router.get("/", (req, res)=>{
//     res.redirect("/listings");
// })
// router.get("/testListing", async(req, res)=>{
//     let sampleListing= new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 2000,
//         location: "Calamgute, Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("Saved sample");
//     res.send("Successfull Testing..");
// })

//Using router.route for grouping.
router.route("/").get(wrapAsync(listingController.index)).post(validateListing, isLoggedIn,  wrapAsync( listingController.createRoute));



//home.ejs : INDEX ROUTE , we did above in simpler form along with creation
// router.get("/", wrapAsync(listingController.index ));

//CREATE
//new.ejs: Form to create things...
router.get("/new", isLoggedIn, listingController.renderNewForm)

//POST creation!
// app.post("/listings", async(req, res, next)=>{
//     try{
//         let {title, description, price, image, location, country}= req.body;
//     let newListing= new Listing({
//         title: title,
//         description: description,
//         price: price,
//         image: image,
//         location: location,
//         country: country
//     });
//   await newListing.save();
//   res.redirect("/listings");
//     }
//     catch(err){
//         next(err);
//     }
// }) 
//or
// router.post("/", validateListing, isLoggedIn,  wrapAsync(async (req, res, next)=>{
//         let {title, description, price, image, location, country}= req.body;
//         // if(!req.body){
//         //     throw new ExpressError(400, "Send valid data, ~BAD REQUEST!~")
//         // }
//     //   let result=ListingSchema.validate(req.body);
//     //   if(result.error){
//     //     throw new ExpressError(400, result.error);
//     //   }
//     let newListing= new Listing({
//         title: title,
//         description: description,
//         price: price,
//         image: image,
//         location: location,
//         country: country
//     });
//     newListing.owner= req.user._id;
//   await newListing.save();
//   req.flash("success", "New listing created.")
//   res.redirect("/listings");
// }
// ));

//createdListing
// router.post("/", validateListing, isLoggedIn,  wrapAsync( listingController.createRoute ));

//see.ejs  : SHOW ROUTE (WE USE IT FOR EVERY CRUD's..)
router.get("/:id", wrapAsync(listingController.showRoute));


// UPDATION
// edit.ejs : Form to update things...
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.updateForm));
//update
router.put("/:id",isLoggedIn, isOwner, wrapAsync(listingController.update));

//delete
router.delete("/:id",isLoggedIn, wrapAsync(listingController.deleteListing));



module.exports=router;
```