const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('template')); // Serve static files like images

// Connection string to your MongoDB instance
const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

// Serve static files from the "template" directory
app.use(express.static(path.join(__dirname, 'template')));

// Serve the HTML form at the root route ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'bookform.html')); // Serve the HTML file
});

// Serve the Home.html page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'HomeNEW.html')); // Serve the Home page after form submission
});


async function connectToDb() {
    try {
        await client.connect();
        const db = client.db('bookdb'); // Use your actual database name here
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

app.post('/submit', async (req, res) => {
    // Extracting data from the form
    const { name, email, phone, make, model, year, vin, service, date, time, comments, pickup, pickupAddress, payment } = req.body;

    try {
        const db = await connectToDb();
        const collection = db.collection('appointments'); // Collection where you want to store data

        const appointment = {
            name,
            email,
            phone,
            vehicle: {
                make,
                model,
                year,
                vin,
            },
            services: service || [], // Handle multiple service selections
            preferredDate: date,
            preferredTime: time,
            comments,
            pickup: {
                needService: pickup,
                address: pickup === 'yes' ? pickupAddress : null,
            },
            paymentMethod: payment,
        };

        await collection.insertOne(appointment);
        res.send('Booking submitted successfully and stored in MongoDB!');
        // After successful submission, redirect to Home.html
        res.redirect('/HomeNEW.html');
    } catch (error) {
        res.status(500).send('Error storing data in MongoDB');
    }
});

// JavaScript to handle pickup address visibility
app.get('/script.js', (req, res) => {
    const script = `
        // JavaScript to handle pickup address visibility
        const pickupRadios = document.querySelectorAll('input[name="pickup"]');
        const pickupAddressInput = document.getElementById('pickup-address');

        pickupRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    pickupAddressInput.style.display = 'block';
                } else {
                    pickupAddressInput.style.display = 'none';
                }
            });
        });

        // JavaScript to handle QR code display
        const paymentSelect = document.getElementById('payment');
        const qrCodeImage = document.getElementById('qrCode');

        paymentSelect.addEventListener('change', function() {
            if (this.value === 'qr_code') {
                qrCodeImage.style.display = 'block';
            } else {
                qrCodeImage.style.display = 'none';
            }
        });
    `;
    res.type('application/javascript');
    res.send(script);
});

// Start the server
app.listen(3012, () => {
    console.log('Server is running on http://localhost:3012');
});