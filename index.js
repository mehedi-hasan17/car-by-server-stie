const express = require("express");
const { MongoClient, ServerApiVersion,ObjectId  } = require("mongodb");
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
    const quary = {_id: new ObjectId(id)}
    const result = await carCollection.findOne( quary);
    res.send(result)
    })

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
