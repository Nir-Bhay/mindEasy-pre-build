const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const uri = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
    }
}
run();

let formDataCollection;

async function initializeCollections() {
    const database = client.db("MindEas-data");
    formDataCollection = database.collection("formData");
}
initializeCollections();

app.post('/save-form-data', async (req, res) => {
    const formData = req.body;

    try {
        await formDataCollection.insertOne(formData);
        res.json({ message: 'Form data saved successfully.' });
    } catch (err) {
        console.error("Error saving form data:", err);
        res.status(500).json({ error: 'Failed to save form data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


