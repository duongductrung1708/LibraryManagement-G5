const express = require('express');
const router = express.Router();
const { postPayment, callback } = require('../middleware/vnpay'); // Adjust the path accordingly

// Example route to process payment
router.post('/process', async (req, res) => {
    try {
        const paymentResult = await postPayment(req.body);
        console.log('Payment result:', paymentResult); // Log the payment result

        // Assuming postPayment returns a success response
        res.status(200).json({ 
            success: true, 
            message: 'Payment process initiated.',
            paymentResult // Include the payment result in the response
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Failed to process payment.' });
    }
});

// Route to handle callback from payment service
router.post('/callback', async (req, res) => {
    try {
        const callbackResult = await callback(req.body); // Assuming callback function returns an object
        console.log('Callback result:', callbackResult); // Log the callback result

        // Assuming callback handling returns a success response
        res.status(200).json({ 
            success: true, 
            message: 'Callback processed successfully.',
            callbackResult // Include the callback result in the response
        });
    } catch (error) {
        console.error('Error processing callback:', error);
        res.status(500).json({ success: false, message: 'Failed to process callback.' });
    }
});

module.exports = router;
