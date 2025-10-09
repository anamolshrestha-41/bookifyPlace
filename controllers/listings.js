const Listing= require("../models/listing")

module.exports.index=async(req, res)=>{
   let allListings = await Listing.find({});
   res.render("listings/home.ejs", {allListings});
}

module.exports.renderNewForm=(req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.createRoute=async (req, res, next)=>{
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
    newListing.owner= req.user._id;
  await newListing.save();
  req.flash("success", "New listing created.")
  res.redirect("/listings");
};

module.exports.showRoute=async(req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({path:"reviews", populate:{
        path: "author"
    }}).populate("owner");
    if(!listing){
             req.flash("error", "Listing you requuested isnot available.");
             res.redirect("/listings")
            }
    res.render("listings/see.ejs", {listing});
};

module.exports.updateForm= async(req, res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
        if(!listing){
             req.flash("error", "Listing you requuested isnot available.");
             res.redirect("/listings")
            }
    res.render("listings/edit.ejs", {listing} );
};
module.exports.update=async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing=async(req, res)=>{
    let { id }= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted");
   res.redirect("/listings");
};