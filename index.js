const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
var cors = require('cors')
app.use(cors())
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4oearpf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("user-auth").collection("user")
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    app.post('/users/:email', async(req, res) => {
      const userEmail = req.params.email;
      const userDetail = req.body;
      const userEmailFind = await userCollection.findOne({email:  userEmail })
      if(userEmailFind?.email !== userEmail){
        const result = userCollection.insertOne(userDetail)
        res.send(result);
      }else{
        res.send('Not Added')
      }
    })
  } finally {}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})