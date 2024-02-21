const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.4pbmvpd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  client.connect();
  const productDB = client.db("productDB").collection('products')
  const cartDB = client.db("productDB").collection('Cart')

  app.get('/product', async (req, res) => {
    let result = await productDB.find().toArray()
    res.send(result)
  })


  run().catch(console.dir);

  app.get('/', (req, res) => {
    res.send("Server is up")
  })

  app.listen(port, () => { console.log("Server running at:", port); })
