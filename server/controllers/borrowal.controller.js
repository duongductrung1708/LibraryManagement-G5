const mongoose = require("mongoose");
const db = require('../models');
const Borrowal = db.borrowal;
const Book = db.book;
const User = db.user; 
const sendMail = require('../helpers/sendmaiil');

const getBorrowal = async (req, res) => {
    const borrowalId = req.params.id;

    Borrowal.findById(borrowalId, (err, borrowal) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            borrowal
        });
    });
}

const getAllBorrowals = async (req, res) => {
    try {
        const borrowals = await Borrowal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member"
                }
            },
            {
                $unwind: "$member"
            },
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            }
        ]);
        console.log(borrowals)
        // Cập nhật trường overdue
        const currentDate = new Date();
        for (const borrowal of borrowals) {
            if (borrowal.dueDate < currentDate) {
                await Borrowal.findByIdAndUpdate(borrowal._id, { overdue: true });
                borrowal.overdue = true; // Cập nhật giá trị trong kết quả trả về

                //  // Gửi email thông báo quá hạn
                //  await sendOverdueNotification(borrowal);
            }
        }

        res.status(200).json({
            success: true,
            borrowalsList: borrowals
        });
    } catch (err) {
        res.status(400).json({ success: false, err });
    }
}



async function addBorrowal(req, res, next) {
    try {
        const { memberId, bookId } = req.body;

        // Kiểm tra nếu Borrowal đã tồn tại với bookId nhất định
        const existingBorrowal = await Borrowal.findOne({ bookId: mongoose.Types.ObjectId(bookId) });

        if (existingBorrowal) {
            return res.status(400).json({ success: false, error: 'This book has already been borrowed.' });
        }


        // Nếu không có Borrowal nào tồn tại với bookId này, thêm mới Borrowal
        const newBorrowal = {
            ...req.body,
            memberId: mongoose.Types.ObjectId(memberId),
            bookId: mongoose.Types.ObjectId(bookId)
        };


        const borrowal = await Borrowal.create(newBorrowal);

        // Đánh dấu sách là không có sẵn (isAvailable: false) sau khi được mượn
        await Book.findByIdAndUpdate(newBorrowal.bookId, { isAvailable: false });

        // Trả về thông tin borrowal mới
        res.status(200).json({
            success: true,
            newBorrowal: borrowal
        });
    } catch (err) {
        next(err);
    }
}


async function updateBorrowal(req, res, next) {
    try {
        const borrowalId = req.params.id;
        const { borrowedDate, dueDate, status } = req.body;

        // Tạo một đối tượng rỗng để lưu các trường cập nhật
        let updatedFields = {};
        
        if (borrowedDate) {
            updatedFields.borrowedDate = new Date(borrowedDate);
        }

        if (dueDate) {
            updatedFields.dueDate = new Date(dueDate);
        }

        if (status) {
            updatedFields.status = status;
        }

        console.log('Updating borrowal with ID:', borrowalId);
        console.log('Fields to update:', updatedFields);

      
        // Sử dụng findByIdAndUpdate để cập nhật borrowal
        const updatedBorrowal = await Borrowal.findByIdAndUpdate(
            borrowalId,
            { $set: updatedFields },
            { new: true } // Option to return the updated document
        );

        if (!updatedBorrowal) {
            return res.status(404).json({ success: false, error: 'Borrowal not found' });
        }


          // Sử dụng getEmailFromBorrowalId để lấy email của thành viên
          const memberEmail = await getEmailFromBorrowalId(borrowalId);

          if (!memberEmail) {
              return res.status(404).json({ success: false, error: 'Email not found for the member associated with the borrowal' });
          }

        // Gửi email thông báo khi cập nhật thành công
        try {
            await sendMail({
                email: memberEmail.email,
                subject: 'Thông báo cập nhật thông tin mượn sách',
                html: `
                    <p>Hello, ${memberEmail.name}</p>
                    <p>Thông tin mượn sách của bạn đã được cập nhật thành công!</p>
                    <p>Best regards,<br>Your Team</p>
                `
            });
        } catch (mailError) {
            console.error('Error sending email:', mailError);
            return res.status(500).json({ success: false, error: 'Failed to send email notification' });
        }

        // Trả về thông tin borrowal đã cập nhật
        res.status(200).json({ updatedBorrowal });
    } catch (err) {
        console.error('Error updating borrowal:', err);
        next(err);
    }
}


const getEmailFromBorrowalId = async (borrowalId) => {
    try {
        const borrowal = await Borrowal.findById(borrowalId);
        if (!borrowal) {
            throw new Error('Borrowal not found');
        }

        const memberId = borrowal.memberId;
        const member = await User.findById(memberId);
        if (!member) {
            throw new Error('Member not found');
        }

        return {
            email: member.email,
            name: member.name,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};


const deleteBorrowal = async (req, res) => {
    const borrowalId = req.params.id

    Borrowal.findByIdAndDelete(borrowalId, (err, borrowal) => {
        if (err) {
            return res.status(400).json({success: false, err});
        }

        Book.findByIdAndUpdate(borrowal.bookId, {isAvailable: true}, (err, book) => {
            if (err) {
                return res.status(400).json({success: false, err});
            }

            return res.status(200).json({
                success: true,
                deletedBorrowal: borrowal
            });
        });
    })
}


const sendOverdueNotification = async (borrowal) => {
    try {
        await sendMail({
            email: borrowal.member.email,
            subject: 'Thông báo quá hạn trả sách',
            html: `
                <p>Xin chào, ${borrowal.member.name}</p>
                <p>Bạn đang có sách quá hạn trả. Vui lòng trả sách sớm nhất có thể.</p>
                <p>Trân trọng,</p>
                <p>Đội của bạn</p>
            `
        });

        // Đánh dấu rằng email thông báo đã được gửi
        await Borrowal.findByIdAndUpdate(borrowal._id, { notificationSent: true });
    } catch (error) {
        console.error('Error sending overdue notification:', error);
    }
};


const borrowalController ={
    getBorrowal,
    getAllBorrowals,
    addBorrowal,
    updateBorrowal,
    deleteBorrowal,
    getEmailFromBorrowalId
}


module.exports =  borrowalController;