const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const ordersDatabase = client.db("laptobBddata").collection("orders");
    const usersDatabase = client.db("laptobBddata").collection("users");


    // Get all Data from the database and send client server
    // app.get("/products", async (req, res) => {
    //   const query = {};
    //   const cursor = laptopBdDatabase.find(query);
    //   const products = await cursor.toArray();
    //   res.send(products);
    // });

    // API Make for pagination and also get data from database
    app.get("/products", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = laptopBdDatabase.find(query);
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await laptopBdDatabase.estimatedDocumentCount();
      res.send({ products, count });
    });

    // API Make for OrderBox by using ID (67-3)
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await laptopBdDatabase.findOne(query);
      res.send(order);
    });

    // Users API
    // This API User for data send usersDatabase
    app.post("/users", async (req, res) => {
      const user = req.body;
      const userData = usersDatabase.insertOne(user);
      res.send(userData);
    });
 
    // Orders API

    // This order API Link to us Front-end OrderBox and receive data from font-end and also send data Database
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = ordersDatabase.insertOne(order);
      res.send(result);
    });

    // Get API for Load Cart make a cart table
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = ordersDatabase.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // Remove Order from cart
      app.delete("/orders/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await ordersDatabase.deleteOne(query);
      res.send(result)

    });
  
  
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("LaptopBD server is running");
});

app.listen(port, () => console.log(`LaptopBD Server running on ${port}`));
