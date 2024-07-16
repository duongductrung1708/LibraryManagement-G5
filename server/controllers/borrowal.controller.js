const mongoose = require("mongoose");
const db = require('../models');
const Borrowal = db.borrowal;
const Book = db.book;
const User = db.user; 
const Fines = db.fine;
const sendMail = require('../middleware/sendmaiil');

function formatDate(date) {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();
  
    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;
  
    return [day, month, year].join("/");
  }

  const createFine = async (borrowalId, returnDate) => {
    const borrowal = await Borrowal.findById(borrowalId);

    if (!borrowal) {
        throw new Error('Borrowal record not found');
    }

    const { daysOverdue, fineAmount } = calculateFine(borrowal.borrowedDate, borrowal.dueDate, returnDate);

    if (daysOverdue > 0) {
        const fine = new Fines({
            borrowalId: borrowal._id,
            fineAmount,
            daysOverdue
        });
        await fine.save();
        return fine;
    } else {
        return null; // Không có tiền phạt nếu không có ngày quá hạn
    }
};

const calculateFine = (borrowedDate, dueDate, returnDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const daysOverdue = Math.round((returnDate - dueDate) / oneDay);

    if (daysOverdue > 0) {
        const fineAmount = daysOverdue * 1000; // Giả sử mỗi ngày quá hạn phạt 1000 đồng
        return { daysOverdue, fineAmount };
    } else {
        return { daysOverdue: 0, fineAmount: 0 };
    }
};

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

        // Cập nhật borrowal
        const updatedBorrowal = await Borrowal.findByIdAndUpdate(
            borrowalId,
            { $set: updatedFields },
            { new: true } // Tùy chọn để trả về tài liệu đã cập nhật
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
        if (status === "accepted") {
            let emailSubject = 'Thông báo cập nhật thông tin mượn sách';
            let emailContent = `
                <p>Hello, ${memberEmail.name}</p>
                <p>Thông tin mượn sách của bạn đã được cập nhật thành công!</p>
                <p>Best regards,<br>Your Team</p>
            `;
            
            // Nếu không có borrowedDate và dueDate được cung cấp
            if (!borrowedDate && !dueDate) {
                emailSubject = 'Xác nhận đặt lịch mượn sách thành công';
                emailContent = `
                    <p>Hello, ${memberEmail.name}</p>
                    <p>Yêu cầu mượn sách của bạn đã được chấp nhận và đã được đặt lịch thành công!</p>
                    <p>Best regards,<br>Your Team</p>
                `;
            } else {
                // Nếu có borrowedDate và dueDate được cung cấp
                const formatbrrDate = formatDate(updatedBorrowal.borrowedDate);
                const formatdueDate = formatDate(updatedBorrowal.dueDate);
                emailContent = `
                    <p>Hello, ${memberEmail.name}</p>
                    <p>Bạn đã mượn sách thành công!</p>
                    <p>Thời gian mượn sách của bạn bắt đầu từ ${formatbrrDate} đến ngày ${formatdueDate}. Vui lòng chú ý hạn trả sách.</p>
                    <p>Best regards,<br>Your Team</p>
                `;
            }

            try {
                await sendMail({
                    email: memberEmail.email,
                    subject: emailSubject,
                    html: emailContent
                });
            } catch (mailError) {
                console.error('Error sending email:', mailError);
                return res.status(500).json({ success: false, error: 'Failed to send email notification' });
            }
        } else if (status === "rejected") {
            try {
                await sendMail({
                    email: memberEmail.email,
                    subject: 'Thông báo cập nhật thông tin mượn sách',
                    html: `
                        <p>Hello, ${memberEmail.name}</p>
                        <p>Yêu cầu mượn sách của bạn đã bị từ chối.</p>
                        <p>Best regards,<br>Your Team</p>
                    `
                });
            } catch (mailError) {
                console.error('Error sending email:', mailError);
                return res.status(500).json({ success: false, error: 'Failed to send email notification' });
            }
        } else if (status === "returned") {
            const returnDate = new Date();
            updatedBorrowal.returnDate = returnDate;
            await updatedBorrowal.save();

            // Tạo tiền phạt nếu có
            const fine = await createFine(borrowalId, returnDate);

            let emailContent = `
                <p>Hello, ${memberEmail.name}</p>
                <p>Bạn đã trả sách thành công.</p>
                ${fine ? `<p>Bạn có tiền phạt quá hạn là ${fine.fineAmount} đồng cho ${fine.daysOverdue} ngày quá hạn.</p>` : ''}
                <p>Best regards,<br>Your Team</p>
            `;

            try {
                await sendMail({
                    email: memberEmail.email,
                    subject: 'Thông báo cập nhật thông tin mượn sách',
                    html: emailContent
                });
            } catch (mailError) {
                console.error('Error sending email:', mailError);
                return res.status(500).json({ success: false, error: 'Failed to send email notification' });
            }
        }

        // Trả về thông tin borrowal đã cập nhật
        res.status(200).json({ success: true, updatedBorrowal });
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