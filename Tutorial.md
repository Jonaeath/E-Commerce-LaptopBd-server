const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 4000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pg0dj0q.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect mongodb database with local server
    const laptopBdDatabase = client.db("laptobBddata").collection("products");

    // Get all Data from the database and send client server
    // app.get("/products", async (req, res) => {
    //   const query = {};
    //   const cursor = laptopBdDatabase.find(query);
    //   const products = await cursor.toArray();
    //   res.send(products);
    // });

    when we made a api for pagination,then we remove previous api because we send products and count same api form server 

    // API Make for pagination
      app.get("/products", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = laptopBdDatabase.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      const count = await laptopBdDatabase.estimatedDocumentCount();
      res.send({products,count});
    });

  } finally {

  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("LaptopBD server is running");
});

app.listen(port, () => console.log(`LaptopBD Server running on ${port}`));
