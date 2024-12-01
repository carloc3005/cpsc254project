const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tapioca_express', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

// Define the Order schema
const orderSchema = new mongoose.Schema({
    orderNumber: Number,
    items: Array,
    total: Number,
    date: { type: Date, default: Date.now }
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Handle order submission
app.post('/submit-order', async (req, res) => {
    try {
        const orderData = req.body;

        // Save the order to the database
        const order = new Order(orderData);
        await order.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving order:', error);
        res.json({ success: false });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
