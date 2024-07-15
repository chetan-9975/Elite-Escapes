const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");
const listingSchema=new Schema(
    {
        title:
        {
            type:String,
            required:true,
        },
        description:
        {
            type:String,
            required:true,
        },
        image:{
           url:String,
           filename:String,
        },
        price:
        {
            type:Number,
            required:true,
        },
        location:{
            type:String,
            required:true,
        },
        country:
        {
            type:String,
            required:true,
        },
        reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",

        }
        
    ],
    owner:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    geometry:
    {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category: String,
    trending: {type:Boolean,default:true}

    }
);

listingSchema.post("findOneandDelete", async(listing)=> {
    if(listing)
        {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const listing =mongoose.model("listing",listingSchema);

module.exports=listing;