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

const getAll = async (req, res, next) => {
    try {
        const fines = await Fine.find()
        .populate({
            path: 'borrowalId',
            populate: [
                {
                    path: 'bookId',
                    model: 'Book',
                    select: 'name' // Chọn các trường cần thiết của Book
                },
                {
                    path: 'memberId',
                    model: 'User',
                    select: 'name' // Chọn các trường cần thiết của User
                }
            ]
        });

        const formatfines = fines.map(f => {
            return {
                _id: f._id,
                memberId: f.borrowalId.memberId._id,
                username : f.borrowalId.memberId.name,
                book : f.borrowalId.bookId.name,
                requestDate : f.borrowalId.requestDate,
                borrowedDate : f.borrowalId.borrowedDate,
                dueDate : f.borrowalId.dueDate,
                status : f.borrowalId.status,
                fineAmount : f.fineAmount,
                daysOverdue :f.daysOverdue,
                status :f.status
            }
        })

        return res.status(200).json({ success: true, formatfines });
    } catch (err) {
        console.error('Error getting fines by borrowal ID:', err);
        next(err);
    }
};

const getFines = async (req, res, next) => {
    try {
        const fid = req.params.id;
        const fines = await Fine.findById(fid)
            .populate({
                path: 'borrowalId',
                populate: [
                    {
                        path: 'bookId',
                        model: 'Book',
                        select: 'name' 
                    },
                    {
                        path: 'memberId',
                        model: 'User',
                        select: 'name' 
                    }
                ]
            });

        if (!fines) {
            return res.status(404).json({ success: false, message: 'Fine not found' });
        }

        const formatfines = {
            _id: fines._id,
            username: fines.borrowalId.memberId.name,
            book: fines.borrowalId.bookId.name,
            requestDate: fines.borrowalId.requestDate,
            borrowedDate: fines.borrowalId.borrowedDate,
            dueDate: fines.borrowalId.dueDate,
            status: fines.borrowalId.status,
            fineAmount: fines.fineAmount,
            daysOverdue: fines.daysOverdue,
            status: fines.status
        };

        return res.status(200).json({ success: true, fines: formatfines });
    } catch (err) {
        console.error('Error getting fines by borrowal ID:', err);
        next(err);
    }
};

const updateFineStatus = async (req, res, next) => {
    try {
        const fineId = req.params.id;
        console.log(fineId);
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
        const formatfines = fines.map(f => {
            return {
                _id: f._id,
                username : f.borrowalId.memberId.name,
                book : f.borrowalId.bookId.name,
                requestDate : f.borrowalId.requestDate,
                borrowedDate : f.borrowalId.borrowedDate,
                dueDate : f.borrowalId.dueDate,
                status : f.borrowalId.status,
                fineAmount : f.fineAmount,
                daysOverdue :f.daysOverdue,
                status :f.status
            }
        })
        return res.status(200).json({ success: true, formatfines });
    } catch (err) {
        console.error('Error getting fines by borrowal ID:', err);
        next(err);
    }
};

const getFinesByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id; 
        
        // Tìm tất cả các borrowals của userId
        const borrowals = await Borrowal.find({ memberId: userId });
        
        // Lấy danh sách borrowalIds từ các borrowals tìm được
        const borrowalIds = borrowals.map(b => b._id);
        
        // Tìm tất cả các fines có borrowalId thuộc danh sách borrowalIds
        const fines = await Fine.find({ borrowalId: { $in: borrowalIds } })
            .populate({
                path: 'borrowalId',
                populate: [
                    {
                        path: 'bookId',
                        model: 'Book',
                        select: 'name' // Chọn các trường cần thiết của Book
                    },
                    {
                        path: 'memberId',
                        model: 'User',
                        select: 'name' // Chọn các trường cần thiết của User
                    }
                ]
            });

        // Biến đổi dữ liệu để trả về
        const formatfines = fines.map(f => {
            return {
                username: f.borrowalId.memberId.name,
                book: f.borrowalId.bookId.name,
                requestDate: f.borrowalId.requestDate,
                borrowedDate: f.borrowalId.borrowedDate,
                dueDate: f.borrowalId.dueDate,
                status: f.borrowalId.status,
                fineAmount: f.fineAmount,
                daysOverdue: f.daysOverdue,
                fineStatus: f.status // Đổi tên 'status' thành 'fineStatus' để tránh trùng lặp
            };
        });

        return res.status(200).json({ success: true, fines: formatfines });
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

const fineController = {
    updateFineStatus,
    getFinesByBorrowalId,
    getFinesByUserId,
    deleteFine,
    getAll,
    getFines
};

module.exports = fineController;
