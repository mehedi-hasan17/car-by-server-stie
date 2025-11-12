const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 3000;

// VTCIux8qR5cUBISX
// car-by
app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://car-by:VTCIux8qR5cUBISX@cluster0.qqb9b6u.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
async function run() {
  try {
    const db = client.db("car-bd");
    const carCollection = db.collection("cars");
    const bookingCollection = db.collection("bookings");
    console.log(carCollection);

    app.get("/cars", async (req, res) => {
      const result = await carCollection.find().toArray();
      res.send(result);
    });

    app.get("/latest-cars", async (req, res) => {
      const cursor = carCollection.find().sort({ createdAt: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(quary);
      res.send(result);
    });

    app.post("/cars", async (req, res) => {
      const newcar = req.body;
      const result = await carCollection.insertOne(newcar);
      res.send(result);
    });

    app.get('/search', async(req,res)=>{
      const searchValue = req.query.search
      const result =await carCollection.find({name: {$regex: searchValue, $options : 'i'}}).toArray()
      res.send(result)
    })

    // GET all cars by provider email
    app.get("/my-listings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { providerEmail: email };
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });

    // GET bookings by user email
    app.get("/my-bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { bookedBy: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // POST - Create a new booking
    app.post("/bookings", async (req, res) => {
      const booking = req.body; // frontend থেকে আসা ডেটা
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { status: "unavailable" },
      };
      const result = await carCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const result = await carCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    });

    app.delete("/cars/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// vercel --prod
