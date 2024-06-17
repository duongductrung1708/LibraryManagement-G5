
async function validateCookies(req, res, next) {
    await cookieValidator(req.cookies)
    next()
}
// cookieValidator.js
async function cookieValidator(cookies) {
    try {
      await externallyValidateCookie(cookies.testCookie);
      
    } catch {
      throw new Error('Invalid cookies');
    }
}
async function externallyValidateCookie(cookie) {
    // Giả sử đây là logic xác thực bên ngoài, ví dụ gọi API bên ngoài
    if (cookie !== 'valid_cookie_value') {
      throw new Error('Invalid cookie');
    }
    return false;
  }
  
module.exports = validateCookies;
  