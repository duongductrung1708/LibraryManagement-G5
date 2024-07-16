const express = require('express');
const router = express.Router();
const { postPayment } = require('../middleware/vnpay');

// Example route to process payment
router.post('/process', (req, res) => {
    try {
        postPayment(req.body); 
        res.status(200).json({ success: true, message: 'Payment process initiated.' });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Failed to process payment.' });
    }
});

// Example route for payment callback
router.post('/callback', (req, res) => {
  
    res.status(200).json({ success: true, message: 'Callback received.' });
});

module.exports = router;
