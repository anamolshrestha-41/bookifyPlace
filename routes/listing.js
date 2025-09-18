const express= require("express");
const router= express.Router();
const Listing= require("../models/listing.js")
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js")
const {ListingSchema}=require("../schema.js");

const validateListing=(req, res, next)=>{
 let {error}=ListingSchema.validate(req.body);
 if(error) {
    let errMsg= error.details.map ((element)=>element.message).join(",");
    throw new ExpressError(404, error);
 }  
 else{
    next();
 }
}

//checking..
router.get("/", (req, res)=>{
    res.redirect("/listings");
})
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

//home.ejs : INDEX ROUTE
router.get("/", wrapAsync(async(req, res)=>{
   let allListings = await Listing.find({});
   res.render("listings/home.ejs", {allListings});
}));

//CREATE
//new.ejs: Form to create things...
router.get("/new", (req, res)=>{
    res.render("listings/new.ejs");
})
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
router.post("/", validateListing, wrapAsync(async (req, res, next)=>{
        let {title, description, price, image, location, country}= req.body;
        // if(!req.body){
        //     throw new ExpressError(400, "Send valid data, ~BAD REQUEST!~")
        // }
    //   let result=ListingSchema.validate(req.body);
    //   if(result.error){
    //     throw new ExpressError(400, result.error);
    //   }
    let newListing= new Listing({
        title: title,
        description: description,
        price: price,
        image: image,
        location: location,
        country: country
    });
  await newListing.save();
  res.redirect("/listings");
}
));

//see.ejs  : SHOW ROUTE (WE USE IT FOR EVERY CRUD's..)
router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/see.ejs", {listing});
}));


// UPDATION
// edit.ejs : Form to update things...
router.get("/:id/edit",  wrapAsync(async(req, res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing} );
}));
//update
router.put("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete
router.delete("/:id", wrapAsync(async(req, res)=>{
    let { id }= req.params;
    await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
}));



module.exports=router;