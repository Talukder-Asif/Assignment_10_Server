const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware declarations

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.SECRET_KEY}@cluster0.eykzqz7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const dataColletion = client.db("productDB").collection("product");

    // To find the data form data base we can do this
    app.get("/product", async (req, res) => {
      const result = await dataColletion?.find().toArray();
      res.send(result);
    });
    // add a product in sercer
    app.post("/product", async (req, res) => {
      const newproduct = req.body;
      const result = await dataColletion?.insertOne(newproduct);
      res.send(result);
    });
    // Delete a single item from the database
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataColletion.deleteOne(query);
      res.send(result);
    });
    // Update a single item in the database

    // Before updating, lets find the item
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await dataColletion.findOne(quary);
      res.send(result);
    });
    // Let update the item
    app.put("/product/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedproduct = req.body;
      const updatedDoc = {
        $set: {
          name : updatedproduct.name,
          brand : updatedproduct.brand, 
          price : updatedproduct.price, 
          category : updatedproduct.category, 
          ratting : updatedproduct.ratting, 
          details : updatedproduct.details, 
          photo : updatedproduct.photo,
        },
      };
      const result = await dataColletion.updateOne(filter, updatedDoc, options);
      res.send(result);
    });



// let find the producs based on the brans name

    app.get("brands/:brand", async (req, res) => {
      const brand = req.params.brand;
      const quary = { brand: (brand) };
      const result = await dataColletion.findOne(quary);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Routes declarations
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
