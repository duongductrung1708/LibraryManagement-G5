const express = require('express');
const Finerouter = express.Router();
const fineController = require('../controllers/fine.controller');


// Route để cập nhật trạng thái tiền phạt
Finerouter.put('/update/:id', fineController.updateFineStatus);

// Route để lấy danh sách tiền phạt theo borrowalId
Finerouter.get('/fines/:id', fineController.getFinesByBorrowalId);

// Route để lấy danh sách tiền phạt theo userId
Finerouter.get('/fines/:id', fineController.getFinesByUserId);
Finerouter.get('/getAll', fineController.getAll);
// Route để xóa tiền phạt
Finerouter.delete('/fines/:id', fineController.deleteFine);

module.exports = Finerouter;
