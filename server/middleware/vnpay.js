const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const express = require('express');
const moment = require('moment');

// APP INFO
const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const app = express();
app.use(express.json());

// Endpoint for ZaloPay callback
app.post('/callback', (req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        console.log("Received MAC:", reqMac);
        console.log("Calculated MAC:", mac);

        // Validate callback
        if (reqMac !== mac) {
            // Invalid callback
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // Successful payment
            // Update order status
            let dataJson = JSON.parse(dataStr);
            console.log("Update order status to success where app_trans_id =", dataJson["app_trans_id"]);

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server will retry callback (up to 3 times)
        result.return_message = ex.message;
    }

    // Send response to ZaloPay server
    res.json(result);
});

// Example function to initiate payment request
const postPayment = function(orderData) {
    const embed_data = {};
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: "user123",
        app_time: Date.now(), // milliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "zalopayapp",
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    axios.post(config.endpoint, null, { params: order })
        .then(res => {
            console.log("Payment response:", res.data);
        })
        .catch(err => console.error("Payment error:", err));
};

// Example function to handle VNPay transactions
const vnpay = {
};

module.exports = {
    postPayment: postPayment,
};
