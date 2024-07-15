const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/hotelDB");

}

main().then((res)=>
{
    console.log("connected to DB");
})
.catch((err)=>
{
    console.log(err);
});


const initDB = async () => {
    try {
        await listing.deleteMany({});
        const listingsWithOwner = initData.data.map((obj) => ({
            ...obj,
            owner: "668e56d3413eb7f23729c15f",
        }));
        await listing.insertMany(listingsWithOwner);
        console.log("Data initialized");
    } catch (err) {
        console.error("Initialization error", err);
    }
};

initDB();