const mongoose = require("mongoose");
const db = require('../models');
const Borrowal = db.borrowal;
const Book = db.book;

async function getBorrowalById(req, res, next) {
    try {
        const borrowalId = req.params.id;
        const borrowal = await Borrowal.findById(borrowalId);        
        res.status(200).json({borrowal : borrowal})
    } catch (error) {
        next(error)
    }
}

async function getAllBorrowals(req, res, next) {
    try {
        const borrowalsList = await Borrowal.find({})
            .populate('memberId', 'name') 
            .populate('bookId', 'name');   
        
        res.status(200).json({
            success: true,
            borrowalsList: borrowalsList.map(borrowal => ({
                borrowal: borrowal,
                member: borrowal.memberId.name, 
                book: borrowal.bookId.name      
            }))
        });
    } catch (error) {
        console.error('Error in getAllBorrowals:', error);
        next(error);
    }
}

async function addBorrowal(req, res, next) {
    try {
        const newBorrowal = await Borrowal.create({
            ...req.body,
            memberId: mongoose.Types.ObjectId(req.body.memberId),
            bookId: mongoose.Types.ObjectId(req.body.bookId)
        });

        await Book.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.body.bookId),
            { isAvailable: false }
        );

        res.status(200).json({
            success: true,
            newBorrowal: newBorrowal
        });
    } catch (error) {
        console.error('Error in addBorrowal:', error);
        next(error);
    }
}

async function updateBorrowal(req, res, next) {
    try {
        const borrowalId = req.params.id;

        const updatedBorrowal = await Borrowal.findByIdAndUpdate(
            borrowalId,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedBorrowal) {
            return res.status(404).json({ success: false, error: 'Borrowal not found' });
        }

        res.status(200).json({
            success: true,
            updatedBorrowal: updatedBorrowal
        });
    } catch (error) {
        console.error('Error in updateBorrowal:', error);
        next(error);
    }
}


async function deleteBorrowal(req, res, next) {
    try {
        const borrowalId = req.params.id;

        const deletedBorrowal = await Borrowal.findByIdAndDelete(borrowalId);

        if (!deletedBorrowal) {
            return res.status(404).json({ success: false, error: 'Borrowal not found' });
        }

        await Book.findByIdAndUpdate(deletedBorrowal.bookId, { isAvailable: true });

        res.status(200).json({
            success: true,
            deletedBorrowal: deletedBorrowal
        });
    } catch (error) {
        console.error('Error in deleteBorrowal:', error);
        next(error);
    }
}

const borrowalController ={
    getBorrowalById,
    getAllBorrowals,
    addBorrowal,
    updateBorrowal,
    deleteBorrowal
}


module.exports =  borrowalController;