const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fine.contronller');

// Route để trả sách và tạo ra tiền phạt nếu có id ở đây là borrowal id
router.post('/fines/:id', fineController.returnBook);

// Route để tạo tiền phạt (thường không cần vì hàm returnBook đã thực hiện)
router.post('/fines/:id', fineController.createFine);

// Route để cập nhật trạng thái tiền phạt
router.put('/fines/:id', fineController.updateFineStatus);

// Route để lấy danh sách tiền phạt theo borrowalId
router.get('/fines/:id', fineController.getFinesByBorrowalId);

// Route để lấy danh sách tiền phạt theo userId
router.get('/fines/:id', fineController.getFinesByUserId);

// Route để xóa tiền phạt
router.delete('/fines/:id', fineController.deleteFine);

module.exports = router;
