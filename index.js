const express = require('express');
const { MongoClient } = require('mongodb');
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

        //POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
            console.log('hit the post api', service);

            const result = await serviecesCollection.insertOne(service);
            console.log(result)
            res.send(result)
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
