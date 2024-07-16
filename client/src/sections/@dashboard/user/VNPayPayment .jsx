import crypto from 'crypto';
import { useState } from 'react';

const VNPayPayment = () => {
  const [orderAmount, setOrderAmount] = useState(0); // Số tiền thanh toán
  const [orderInfo, setOrderInfo] = useState(''); // Thông tin đơn hàng
  const [redirectUrl, setRedirectUrl] = useState(''); // URL để chuyển hướng thanh toán

  // Hàm tạo URL chuyển hướng đến VNPAY
  const generateVNPayUrl = () => {
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // URL của VNPAY Sandbox
    const vnp_TmnCode = 'DEMOV210'; // Mã TmnCode của merchant
    const vnp_HashSecret = 'your_secret_key'; // Secret key của merchant

    // Chuẩn bị các tham số cần gửi đến VNPAY
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnp_TmnCode,
      vnp_Amount: orderAmount * 100, // Số tiền thanh toán, nhân 100 để loại bỏ phần thập phân
      vnp_CurrCode: 'VND',
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: 'https://domainmerchant.vn/ReturnUrl', // URL để VNPAY chuyển hướng sau khi thanh toán thành công
      vnp_IpAddr: '127.0.0.1', // Địa chỉ IP của khách hàng
      vnp_CreateDate: new Date().toISOString().replace(/[-T:.Z]/g, ''), // Ngày tạo đơn hàng, format yyyyMMddHHmmss
      vnp_Locale: 'vn',
    };

    // Sắp xếp các tham số theo thứ tự alphabet và tạo chuỗi dữ liệu cần ký
    const sortedData = Object.keys(vnp_Params).sort().reduce((acc, key) => {
      return (acc += `&${key}=${encodeURIComponent(vnp_Params[key])}`);
    }, '');

    // Tạo mã kiểm tra bằng mã bí mật
    const secureHash = crypto
      .createHmac('SHA256', vnp_HashSecret)
      .update(sortedData.substring(1))
      .digest('hex')
      .toUpperCase();

    // Thêm mã kiểm tra vào danh sách tham số
    vnp_Params['vnp_SecureHash'] = secureHash;

    // Tạo URL chuyển hướng
    const redirectUrl = `${vnpUrl}?${sortedData}`;

    // Lưu URL để chuyển hướng
    setRedirectUrl(redirectUrl);
  };

  // Xử lý khi người dùng click thanh toán
  const handlePayment = () => {
    generateVNPayUrl();
    if (redirectUrl) {
      window.location.href = redirectUrl; 
    }
  };

  return (
    <div>
      <h2>Thanh Toán VNPAY</h2>
      <label>Số tiền thanh toán:</label>
      <input
        type="number"
        value={orderAmount}
        onChange={(e) => setOrderAmount(e.target.value)}
      />
      <br />
      <label>Thông tin đơn hàng:</label>
      <input
        type="text"
        value={orderInfo}
        onChange={(e) => setOrderInfo(e.target.value)}
      />
      <br />
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default VNPayPayment;
