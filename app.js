const express= require("express");
const app = express();
const port= 8080;
const path= require("path");
const mongoose= require("mongoose");
const MONGODB_URL= "mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js")
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main().then(()=>console.log("MongoDB Successfully Connected...")).catch(error=>console.log(error));
async function main(){
    await mongoose.connect(MONGODB_URL);
}

//checking..
app.get("/", (req, res)=>{
    res.redirect("/listings");
})
// app.get("/testListing", async(req, res)=>{
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
app.get("/listings", async(req, res)=>{
   let allListings = await Listing.find({});
   res.render("listings/home.ejs", {allListings});
})



//CREATE
//new.ejs: Form to create things...
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
})
//POST creation!
app.post("/listings", async(req, res)=>{
    let {title, description, price, image, location, country}= req.body;
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
})

//see.ejs  : SHOW ROUTE (WE USE IT FOR EVERY CRUD's..)
app.get("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/see.ejs", {listing});
})


// UPDATION
// edit.ejs : Form to update things...
app.get("/listings/:id/edit", async(req, res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing} );
})
//update
app.put("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete
app.delete("/listings/:id", async(req, res)=>{
    let { id }= req.params;
    await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
})

app.listen(port, ()=>{
    console.log(`Server is running on port number ${port}..`);
})