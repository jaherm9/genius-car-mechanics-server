const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ztnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const serviecesCollection = database.collection('services');
        // GEP API
        app.get('/services', async(req, res) => {
            const cursor = serviecesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //GET Single Service
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id:ObjectId(id) };
            const service = await serviecesCollection.findOne(query);
            res.json(service);
        })
        //POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await serviecesCollection.insertOne(service);
            console.log(result)
            res.send(result)
        })

        // DELETE API
        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviecesCollection.deleteOne(query);
            res.json(result);
        })
    }
    

    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running Genius Server');
})

app.listen(port, () =>{
    console.log('Runnig Genius Server on Port', port)
})
