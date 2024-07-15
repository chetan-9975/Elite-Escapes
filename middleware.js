const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
let {listingSchema}=require("./schema.js");
module.exports.validateListing=async(req,res,next)=>
    {
        let result=listingSchema.validate(req.body);
        let err=result.error;
        if(err){
            let errMsg=err.details.map((ele)=>ele.message).join(",");
            throw new ExpressError(400, errMsg);
        } else{
            next();
        }
    };
module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
        
        {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must Login to Create Listing!!!");
            res.redirect("/login");
        }
       next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>
{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You do not have the Permissions!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isAuthor=async(req,res,next)=>
    {
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.currUser._id))
        {
            req.flash("error","You do not have the Permissions!");
            return res.redirect(`/listings/${id}`);
        }
    
        next();
    };

   