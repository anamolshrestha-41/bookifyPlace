const mongoose= require("mongoose");
const initData=require("./data.js");
const Listing= require("../models/listing.js");
const MONGODB_URL= "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>console.log("MongoDB Successfully Connected...")).catch(error=>console.log(error));
async function main(){
    await mongoose.connect(MONGODB_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized...")
}

initDB();