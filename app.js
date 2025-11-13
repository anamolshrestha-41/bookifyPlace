if(process.env.NODE_ENV !="producation"){
require('dotenv').config();
}
// console.log(process.env.secret);

const express= require("express");
const app = express();
const port= 8080;
const path= require("path");
const mongoose= require("mongoose");
// const MONGODB_URL= "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASH_URL;
// const Listing= require("./models/listing.js")
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
// const {ListingSchema, reviewSchema}=require("./schema.js");
// const Review= require("./models/review.js")
const session= require("express-session");

const MongoStore= require("connect-mongo");

const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");

const listingRouter=require("./routes/listing.js")
const reviewRouter= require("./routes/review.js")
const userRouter= require("./routes/user.js")

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));



main().then(()=>console.log("MongoDB Successfully Connected...")).catch(error=>console.log(error));
async function main(){
    await mongoose.connect(dbUrl);
}




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

// const validateReview=(req, res, next)=>{
//  let {error}=reviewSchema.validate(req.body);
//  if(error) {
//     let errMsg= error.details.map ((element)=>element.message).join(",");
//     throw new ExpressError(404, error);
//  }  
//  else{
//     next();
//  }
// }

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        // secret: 'SecretKey from env'
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600
})

const sessionOptions={
    store,
    // secret: "developmentPhase",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true
    }
};

 app.get("/", (req, res)=>{
  res.render("/listings");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//for session support.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success=req.flash("success");
     res.locals.error = req.flash("error");
    res.locals.currentUser= req.user;
     next();
})

// app.get("/registerUser", async(req, res)=>{
//     let fakeUser= new User({
//         email: "stu@gmail.com",
//         username: "delta"
//     })
//  let newUser=  await User.register(fakeUser, "helloworld"); //helloworld is password.
//  res.send(newUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// //checking..
// app.get("/", (req, res)=>{
//     res.redirect("/listings");
// })
// // app.get("/testListing", async(req, res)=>{
// //     let sampleListing= new Listing({
// //         title: "My new villa",
// //         description: "By the beach",
// //         price: 2000,
// //         location: "Calamgute, Goa",
// //         country: "India"
// //     })
// //     await sampleListing.save();
// //     console.log("Saved sample");
// //     res.send("Successfull Testing..");
// // })

// //home.ejs : INDEX ROUTE
// app.get("/listings", wrapAsync(async(req, res)=>{
//    let allListings = await Listing.find({});
//    res.render("listings/home.ejs", {allListings});
// }));

// //CREATE
// //new.ejs: Form to create things...
// app.get("/listings/new", (req, res)=>{
//     res.render("listings/new.ejs");
// })
// //POST creation!
// // app.post("/listings", async(req, res, next)=>{
// //     try{
// //         let {title, description, price, image, location, country}= req.body;
// //     let newListing= new Listing({
// //         title: title,
// //         description: description,
// //         price: price,
// //         image: image,
// //         location: location,
// //         country: country
// //     });
// //   await newListing.save();
// //   res.redirect("/listings");
// //     }
// //     catch(err){
// //         next(err);
// //     }
// // }) 
// //or
// app.post("/listings", validateListing, wrapAsync(async (req, res, next)=>{
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
//   await newListing.save();
//   res.redirect("/listings");
// }
// ));

// //see.ejs  : SHOW ROUTE (WE USE IT FOR EVERY CRUD's..)
// app.get("/listings/:id", wrapAsync(async(req, res)=>{
//     let {id} = req.params;
//     const listing= await Listing.findById(id).populate("reviews");
//     res.render("listings/see.ejs", {listing});
// }));


// // UPDATION
// // edit.ejs : Form to update things...
// app.get("/listings/:id/edit",  wrapAsync(async(req, res)=>{
//     let {id}= req.params;
//     let listing= await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing} );
// }));
// //update
// app.put("/listings/:id", wrapAsync(async(req,res)=>{
//     let {id}= req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// //delete
// app.delete("/listings/:id", wrapAsync(async(req, res)=>{
//     let { id }= req.params;
//     await Listing.findByIdAndDelete(id);
//    res.redirect("/listings");
// }));


// //REVIEWS
// //Post route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res)=>{
// let listing= await Listing.findById(req.params.id);
// let newReview= new Review(req.body.review);
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();
// res.redirect(`/listings/${listing._id}`); 
// }))

// //delete review
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
//     let {id, reviewId}= req.params;

//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }))



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"}=err;
    res.render("error.ejs", {err});
    // res.status(statusCode).send(message);
});




app.listen(port, ()=>{
    console.log(`Server is running on port number ${port}..`);
})


//cookie parser: npm i cookie-parser
//const cookie= require("cookie-parser")
//app.use(cookie());