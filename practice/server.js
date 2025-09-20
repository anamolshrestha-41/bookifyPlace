const express= require("express");
const app= express();
const path= require("path")
// const cookieParser= require("cookie-parser");
const expressSession=require("express-session");
const flash= require("connect-flash");
app.use(flash());


app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(expressSession({secret: "toEasy"}));

const expressSessionOptions={
     secret: "toEasy",
    resave: false,
    saveUninitialized: true,
}

app.use(expressSession(expressSessionOptions ));
// app.use(expressSession({
//     secret: "toEasy",
//     resave: false,
//     saveUninitialized: true,
// }));


// app.get("/requestcount", (req, res)=>{
//    if( req.session.count){
//      req.session.count++;
//    }
//    else{
//      req.session.count= 1;
//    }
//     res.send(`You send a request ${req.session.count}`)
// })

// app.get("/testing", (req, res)=>{
//     res.send("Test success.");
// })

app.get("/register", (req,res)=>{
let {name= "default"}= req.query;
req.session.name=name;
console.log(req.session.name);
// res.send(`You are : ${name}`)
if(name==="default"){
    req.flash("Error", "User Isnot registered");
}
else{
req.flash("Success", "user register successfully")
}
res.redirect("/hello");
})

app.use((req, res, next)=>{
 res.locals.msg=req.flash("Success")
    res.locals.errorMsg= req.flash("Error")
    next();
})
app.get("/hello", (req, res)=>{
    // res.send(`hello, ${req.session.name}`);
    // res.render("page.ejs", {name: req.session.name, msg: req.flash("Success")}); // or we co do below one
    // res.locals.msg=req.flash("Success")
    // res.locals.errorMsg= req.flash("Error")
    res.render("page.ejs", {name: req.session.name});

})



app.listen(3000, ()=>{
    console.log(`Server is running on port no 3000`)
})