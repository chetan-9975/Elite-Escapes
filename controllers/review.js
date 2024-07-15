const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.CreateReview=async(req, res) => {
    const currListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    currListing.reviews.push(newReview);
    await newReview.save();
    await currListing.save();
    req.flash("success","Review Created!");

    console.log("Review Saved Successfully");
    res.redirect(`/listings/${currListing._id}`);
};

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};