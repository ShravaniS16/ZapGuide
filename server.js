const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://localhost:27017'; // Connection string to your MongoDB instance
const client = new MongoClient(uri);

// Serve static files from the "template" directory
app.use(express.static(path.join(__dirname, 'template')));

// Serve the HTML form at the root route ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'contactUs.html')); // Serve the HTML file
});

// Function to connect to the database
async function connectToDb() {
  try {
    await client.connect();
    const db = client.db('feedM'); // Use your actual database name here
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

// Handle form submission
app.post('/submit', async (req, res) => {
  // Extract form data
  const { name, email, message } = req.body;

  try {
    // Connect to MongoDB
    const db = await connectToDb();
    const collection = db.collection('feeds'); // Collection where you want to store data

    // Construct the data to be saved
    const contactMessage = {
      name,
      email,
      message,
      dateSubmitted: new Date() // Capture the submission date
    };

    // Insert the document into the MongoDB collection
    await collection.insertOne(contactMessage); // Use 'contactMessage' for insertion
    res.redirect('/HomeNEW.html'); // Redirect to HomeNEW.html after successful submission
  } catch (error) {
    console.error('Error storing data in MongoDB', error); // Log the actual error
    res.status(500).send('Error storing data in MongoDB');
  }
});

// Start the server
app.listen(3013, () => {
  console.log('Server is running on http://localhost:3013');
});
