const express= require("express");
const app = express();
const port= 8080;
const mongoose= require("mongoose");
const MONGODB_URL= "mongodb://127.0.0.1:270178/wanderlust";
const Listing= require("./models/listing.js")


app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));




main().then(()=>console.log("MongoDB Successfully Connected...")).catch(error=>console.log(error));
async function main(){
    await mongoose.connect(MONGODB_URL);
}

app.listen(port, ()=>{
    console.log(`Server is running on port number ${port}..`);
})