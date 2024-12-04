const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bobaOrders', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for orders
const orderSchema = new mongoose.Schema({
    orderNumber: Number,
    items: Array,
    total: Number,
    userName: String, // Include userName
    userPhone: String // Include userPhone
});

const Order = mongoose.model('Order', orderSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle order submission
app.post('/submit-order', async (req, res) => {
    try {
        console.log('Order received:', req.body); // Log the entire request body to debug

        const newOrder = new Order(req.body);
        await newOrder.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving order:', error);
        res.json({ success: false });
    }
});

// Endpoint to get all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html')); // Adjust to the correct file if needed
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
