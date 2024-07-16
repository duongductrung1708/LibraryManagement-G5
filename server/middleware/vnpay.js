const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const postPayment = async (orderData) => {
    const embed_data = {
        redirecturl: 'https://localhost:3000/'
    };
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
        callback_url: 'http://localhost:8080/api/payment/callback'
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const response = await axios.post(config.endpoint, null, { params: order });
        console.log("Payment response:", response.data); // Log the payment response
        return response.data; // Return the payment response
    } catch (error) {
        console.error("Error in payment request:", error);
        throw error; // Throw error to handle in the route handler
    }
};



const callback = (req, res) => {
    let result = {};
  
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;
    
        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);
    
    
        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr, config.key2);
            console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
    
            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // Send response to ZaloPay server
    res.json(result);
};

module.exports = { postPayment, callback };
