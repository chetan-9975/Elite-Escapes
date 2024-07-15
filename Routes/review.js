const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


// Reviews Create Post Route
router.post("/",isLoggedIn, wrapAsync(reviewController.CreateReview));

// Reviews Delete Route
router.delete("/:reviewId",isLoggedIn,isAuthor ,wrapAsync(reviewController.destroyReview));

module.exports = router;
