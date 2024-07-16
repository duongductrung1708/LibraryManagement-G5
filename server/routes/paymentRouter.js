const express = require('express');
const router = express.Router();
const { postPayment, callback, queryPaymentStatus } = require('../middleware/vnpay'); // Adjust the path accordingly

// Route to process payment
router.post('/process', async (req, res) => {
    try {
        const paymentResult = await postPayment(req.body);
        console.log('Payment result:', paymentResult); 

        
        res.status(200).json({ 
            success: true, 
            message: 'Payment process initiated.',
            paymentResult 
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Failed to process payment.' });
    }
});

// Route to handle callback from payment service
router.post('/callback', callback);
router.post('/status', queryPaymentStatus)

module.exports = router;
