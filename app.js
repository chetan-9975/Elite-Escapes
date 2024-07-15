if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter=require("./Routes/user.js");

const dburl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);
}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
      secret: "mysupersecretcode",
    },
    touchAfter: 24 * 3600,
  });
  
  store.on("error",()=>{
    console.log("ERROR in Mongo Session Stor", err);
  });
  
const sessionOptions={
    store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};




app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>
    {
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.currUser=req.user;
        
        next();
    });





app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;
    if (!err.message) err.message = "Oh No, Something went wrong!";
    console.error(err); // Log the error to the console for debugging
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("App is listening on port 8080");
});
