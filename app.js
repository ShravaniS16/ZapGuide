const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // Connection string to your MongoDB instance
const client = new MongoClient(uri);

// Serve static files from the "template" directory
app.use(express.static(path.join(__dirname, 'template')));

// Serve the login HTML form at the root route ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'login.html')); // Serve the login HTML file
});

// Serve the Home.html page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'HomeNEW.html')); // Serve the Home page after form submission
});

// Function to connect to MongoDB
async function connectToDb() {
    try {
        await client.connect();
        const db = client.db('logindb'); // Use your actual database name here
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

// Function to save form data into MongoDB
app.post('/submit', async (req, res) => {
    const { Username, Password, remember } = req.body;

    try {
        // Save to MongoDB
        const db = await connectToDb();
        const collection = db.collection('users'); // MongoDB collection

        const user = { Username, Password, remember:remember===true, };
        await collection.insertOne(user);

        // After successful submission, redirect to Home.html
        res.redirect('/home');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error storing data in MongoDB');
    }
});

// Start the server on port 3008
app.listen(3020, () => {
    console.log('Server is running on http://localhost:3020');
});