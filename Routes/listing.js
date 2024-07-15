const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({storage});


// Index Route // Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.CreateListing));


//filter route
router.route("/filter/:categoryId").get(isLoggedIn,wrapAsync(listingController.filter));
// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);




// Show Route // Update Route
router.route("/:id").get(wrapAsync(listingController.ShowListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.UpdateListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// Delete Route
router.get("/:id/delete",isOwner, wrapAsync(listingController.destroy));





module.exports = router;
