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

  try {
    client.connect();
    const productDB = client.db("productDB").collection('products')
    const cartDB = client.db("productDB").collection('Cart')

    app.get('/product', async (req, res) => {
      let result = await productDB.find().toArray()
      res.send(result)
    })


    app.get('/product/:id', async (req, res) => {
      let id = req.params.id
      let query = { _id: new ObjectId(id) }
      let result = await productDB.findOne(query)
      res.send(result)
    })

    app.post('/product', async (req, res) => {
      let data = req.body
      let result = await productDB.insertOne(data)
      res.send(result)
    })

    app.put('/product/:id', async (req, res) => {
      let id = req.params.id
      let data = req.body
      console.log(data);
      let filter = { _id: new ObjectId(id) }
      let options = { upsert: true }
      let newProduct = {
        $set: {
          name: data.name,
          brand: data.brand,
          url: data.url,
          type: data.type,
          price: data.price,
          rating: data.rating,
          discription: data.discription
        }
      }
      let result = await productDB.updateOne(filter, newProduct, options)
      res.send(result)
    })
    //For Cart-------------------------------------------------------------------------------- 
    app.get('/cart', async (req, res) => {
      let result = await cartDB.find().toArray()
      res.send(result)
    })

    app.post('/cart', async (req, res) => {
      let data = req.body
      let { _id, ...rest } = data
      let result = await cartDB.insertOne(rest)
      res.send(result)
    })

    app.delete('/cart/:id', async (req, res) => {
      let id = req.params.id;
      let filter = { _id: new ObjectId(id) }
      let result = await cartDB.deleteOne(filter)
      res.send(result)
    })


    // Search with title----------------------------------------------------------------------
    app.get('/search/:title', async (req, res) => {
      let brandName = req.params.title
      let query = { brand: brandName }
      const options = {
        projection: {},
      };
      let result = await productDB.find(query, options).toArray()
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Server is up")
})

app.listen(port, () => { console.log("Server running at:", port); })
