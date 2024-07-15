const mongoose = require("mongoose");
const db = require('../models');
const Borrowal = db.borrowal;
const Book = db.book;
const User = db.user;
const Fine = db.fine;

function formatDate(date) {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("/");
}

const calculateFine = (borrowedDate, dueDate, returnDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const daysOverdue = Math.round((returnDate - dueDate) / oneDay);

    if (daysOverdue > 0) {
        const fineAmount = daysOverdue * 5000; // Giả sử mỗi ngày quá hạn phạt 5000 đồng
        return { daysOverdue, fineAmount };
    } else {
        return { daysOverdue: 0, fineAmount: 0 };
    }
};

const createFine = async (req, res, next) => {
    try {
        const borrowalId = req.params.id;
        const borrowal = await Borrowal.findById(borrowalId);

        if (!borrowal) {
            return res.status(404).json({ success: false, error: 'Borrowal record not found' });
        }

        const { daysOverdue, fineAmount } = calculateFine(borrowal.borrowedDate, borrowal.dueDate, borrowal.returnDate);

        if (daysOverdue > 0) {
            const fine = new Fine({
                borrowalId: borrowal._id,
                fineAmount,
                daysOverdue
            });
            await fine.save();
            return res.status(200).json({ success: true, fine });
        } else {
            return res.status(200).json({ success: true, fine: null }); // Không có tiền phạt nếu không có ngày quá hạn
        }
    } catch (err) {
        console.error('Error creating fine:', err);
        next(err);
    }
};

const updateFineStatus = async (req, res, next) => {
    try {
        const fineId = req.params.id;
        const { status } = req.body;
        const fine = await Fine.findById(fineId);

        if (!fine) {
            return res.status(404).json({ success: false, error: 'Fine record not found' });
        }

        fine.status = status;

        if (status === 'paid') {
            fine.paidAt = new Date();
        }

        await fine.save();
        return res.status(200).json({ success: true, fine });
    } catch (err) {
        console.error('Error updating fine status:', err);
        next(err);
    }
};

const getFinesByBorrowalId = async (req, res, next) => {
    try {
        const borrowalId = req.params.id;
        const fines = await Fine.find({ borrowalId: borrowalId });
        return res.status(200).json({ success: true, fines });
    } catch (err) {
        console.error('Error getting fines by borrowal ID:', err);
        next(err);
    }
};

const getFinesByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const borrowals = await Borrowal.find({ memberId: userId });
        const borrowalIds = borrowals.map(b => b._id);
        const fines = await Fine.find({ borrowalId: { $in: borrowalIds } });
        return res.status(200).json({ success: true, fines });
    } catch (err) {
        console.error('Error getting fines by user ID:', err);
        next(err);
    }
};

const deleteFine = async (req, res, next) => {
    try {
        const fineId = req.params.id;
        const fine = await Fine.findByIdAndDelete(fineId);

        if (!fine) {
            return res.status(404).json({ success: false, error: 'Fine record not found' });
        }

        return res.status(200).json({ success: true, fine });
    } catch (err) {
        console.error('Error deleting fine:', err);
        next(err);
    }
};

const returnBook = async (req, res, next) => {
    try {
        const borrowalId = req.params.id;
        const borrowal = await Borrowal.findById(borrowalId);

        if (!borrowal) {
            return res.status(404).json({ success: false, error: 'Borrowal record not found' });
        }

        const fine = await createFine(req, res, next);

        // Cập nhật trạng thái mượn sách và lưu thông tin ngày trả sách
        borrowal.status = 'returned';
        borrowal.returnDate = new Date();
        await borrowal.save();

        return res.status(200).json({ success: true, borrowal, fine });
    } catch (err) {
        console.error('Error returning book:', err);
        next(err);
    }
};

const fineController = {
    returnBook,
    createFine,
    updateFineStatus,
    getFinesByBorrowalId,
    getFinesByUserId,
    deleteFine
};

module.exports = fineController;
