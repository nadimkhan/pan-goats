require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDB() {
    const uri = process.env.COSMOS_DB_CONNECTION_STRING;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        db = client.db('pan-goats-db');
        // Ensure breedId field is unique by creating a unique index.
        await db.collection('breeds').createIndex({ breedId: 1 }, { unique: true });


    } catch (e) {
        console.error(e);
    }
}

function getDB() {
    return db;
}

async function getNextSequence(name) {
    const sequenceDocument = await getDB().collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false },
    );
    return sequenceDocument.value.sequence_value;
}

module.exports = { connectToDB, getDB, getNextSequence };
