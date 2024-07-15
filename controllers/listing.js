let listing=require("../models/listing.js");
let {listingSchema}=require("../schema.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken});


module.exports.index=async (req, res) => {
    let alllistings = await listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

module.exports.filter=async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      let filterCondition;
  
      switch (categoryId) {
        case '1':
          filterCondition = { trending: true };
          break;
        case '2':
          filterCondition = { category: 'Rooms' };
          break;
        case '3':
          filterCondition = { category: 'Iconic-Cities' };
          break;
        case '4':
          filterCondition = { category: 'Mountains' };
          break;
        case '5':
          filterCondition = { category: 'Castles' };
          break;
        case '6':
          filterCondition = { category: 'Beach' };
          break;
        case '7':
          filterCondition = { category: 'Camping' };
          break;
        case '8':
          filterCondition = { category: 'Skiing' };
          break;
        case '9':
          filterCondition = { category: 'Pools' };
          break;
        case '10':
          filterCondition = { category: 'Arctic' };
          break;
        case '11':
          filterCondition = { category: 'Design' };
          break;
        default:
          filterCondition = {};
      }
  
      const filteredListings = await listing.find(filterCondition);
      res.render('listings', { alllistings: filteredListings });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };
module.exports.renderNewForm=(req, res) => {

    res.render("listings/new.ejs");
};

module.exports.CreateListing=async (req, res) => {
   let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      }).send();
       
    // try {
    //     if (!req.body.listing) {
    //         throw new ExpressError(400, "Send Valid Data for Listing");
    //     }
    //     if (!req.file) {
    //         throw new ExpressError(400, "No file uploaded");
      //  }
        let url = req.file.path;
        let filename = req.file.filename;
        const newlisting = new listing(req.body.listing);
        newlisting.image = { url, filename };
        newlisting.owner = req.user._id;
        newlisting.geometry=response.body.features[0].geometry;
        const savedlisting =await newlisting.save();
        console.log(savedlisting);
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
   //
};

module.exports.ShowListing=async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!Listing)
    {
        req.flash("error","Listing you Requested for does not Exist");
        return res.redirect("/listings");
    }
 
    res.render("listings/show.ejs", { Listing });
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let elisting = await listing.findById(id);
    if(!elisting)
        {
            req.flash("error","Listing you Requested for does not Exist");
            return res.redirect("/listings");
        }
    let originalurl=elisting.image.url;
    originalurl=originalurl.replace("/upload","/upload/h_200,w_250");
    res.render("listings/edit.ejs", { elisting,originalurl });
};

module.exports.destroy=async (req, res) => {
    let { id } = req.params;
    let listingdel = await listing.findOneAndDelete({ _id: id });
    console.log(listingdel);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.UpdateListing=async (req, res) => {
    let { id } = req.params;
    let Listing=await listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !="undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename };
        await Listing.save();


    }
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
};

module.exports.search = async (req, res) => {
  let { title } = req.query;

  const alllistings = await listing.find({ title });
  res.render("./listings/index.ejs", { alllistings });
};