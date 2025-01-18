const { MongoClient } = require('mongodb');

// Connection string to your MongoDB instance
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Function to connect to MongoDB
async function connectToDb() {
    try {
        await client.connect();
        const db = client.db('sharedDB'); // Use a shared database for all your collections
        console.log('Connected to shared database successfully!');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; 
    }
}

module.exports = { connectToDb };
