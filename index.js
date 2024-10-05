const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// CORS configuration
app.use(
  cors({
    origin: ['https://air-bnb-client-seven.vercel.app','https://air-bnb-client-seven.vercel.app/','air-bnb-client-seven.vercel.app','air-bnb-client-seven.vercel.app/'],
  })
);

app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dibths0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("air-bnb");
    const roomsCollection = database.collection("allData");
    app.get('/search',async(req,res)=>{
        const {category,guestCount,allowsPet,wifi,airConditioning,countryLocation,kitchen,instantBooking,selfChecking,guestFavourite,propertyType,bedroomsCount,beds,bathCount,minValue,maxValue,checkInDate,checkOutDate} = req.query 
        let query = { $and: [] };
        console.log(req.query)
        if (countryLocation) query.$and.push({ countryLocation: { $regex: countryLocation, $options: 'i' } });
        if (checkInDate || checkOutDate) {
            query.$and.push({
                checkInDate: { $lte: new Date(checkInDate) } 
            });
            query.$and.push({
                checkOutDate: { $gte: new Date(checkOutDate) } 
            });
        }
          if (guestCount) query.$and.push({ guestCount: { $gte: parseInt(guestCount) } });
          console.log("querying from search",query)
        const result= await roomsCollection.find(query).toArray()
        res.send(result)
    })
    app.get('/allData',async(req,res)=>{
        const {category,guestCount,allowsPet,wifi,airConditioning,countryLocation,kitchen,instantBooking,selfChecking,guestFavourite,propertyType,bedroomsCount,beds,bathCount,minValue,maxValue,checkInDate,checkOutDate} = req.query 
        let query = { $and: [] };
        console.log(req.query)
        if (propertyType) query.$and.push({ propertyType });
          if (category) query.push({ category });
            //search  
            if (countryLocation) query.$and.push({ countryLocation: { $regex: countryLocation, $options: 'i' } });
            if (checkInDate || checkOutDate) {
                query.$and.push({
                    checkInDate: { $lte: new Date(checkInDate) } 
                });
                query.$and.push({
                    checkOutDate: { $gte: new Date(checkOutDate) } 
                });
            }
              if (guestCount) query.$and.push({ guestCount: { $gte: parseInt(guestCount) } });
            //filter by price range
            if (minValue || maxValue) {
                query.$and.push({ price: { $gte: parseInt(minValue) || 0, $lte: parseInt(maxValue) || 1000000 } });
              }
            //filter by bed,bed room
          if (bedroomsCount) query.$and.push({ bedroomsCount: { $gte: parseInt(bedroomsCount) } });
          if (beds) query.$and.push({ beds: { $gte: parseInt(beds) } });
          if (bathCount) query.$and.push({ bathCount: { $gte: parseInt(bathCount) } });
          //filter by all boolean values
          if (allowsPet !== undefined) {
            const allowsPetBool = allowsPet === 'true';  
            query.$and.push({ allowsPet: allowsPetBool });
        }
        if (wifi !== undefined) {
            const wifiBool = wifi === 'true';  
            query.$and.push({ wifi: wifiBool });
        }
        if (airConditioning !== undefined) {
            const airConditioningBool = airConditioning === 'true';  
            query.$and.push({ airConditioning: airConditioningBool });
        }
        if (kitchen !== undefined) {
            const kitchenBool = kitchen === 'true';  
            query.$and.push({ kitchen: kitchenBool });
        }
        if (instantBooking !== undefined) {
            const instantBookingBool = instantBooking === 'true';  
            query.$and.push({ instantBooking: instantBookingBool });
        }
        if (selfChecking !== undefined) {
            const selfCheckingBool = selfChecking === 'true';  
            query.$and.push({ selfChecking: selfCheckingBool });
        }
        if (guestFavourite !== undefined) {
            const guestFavouriteBool = guestFavourite === 'true';  
            query.$and.push({ guestFavourite: guestFavouriteBool });
        }
          if (query.$and.length === 0) {
            query = {}; 
          }
          console.log("querying",query)
        const result= await roomsCollection.find(query).toArray()
        res.send(result)
    })

    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
