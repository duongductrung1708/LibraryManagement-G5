var cron = require('node-cron');
const sendMail = require('../middleware/sendmaiil');
const db = require('../models');
const Borrowal = db.borrowal;
const Review = db.review;

const User = db.user;

cron.schedule('*/2 * * * * *', async (next) => {
    try {
    
        const borrowals = (await Borrowal.find({}).populate('memberId'))
        console.log(borrowals) 
        // const nowUTC = new Date().toISOString();
        // const borrowals = (await Borrowal.find({}).populate('memberId')).map(borrowal => {
        //     if(borrowal)
        //     return sendMail({
        //         email: borrowal.memberId.email,
        //         subject: 'Thông báo từ ethnic group library',
        //         html: `
        //             <p>Hello,<strong>${borrowal.memberId.name}</strong></p><br>
        //             <p>Your account has been created.<br> Here are your credentials: Username: ${borrowal.memberId.email} || Password: <span style="color: blue; font-weight: bold;"></span> <br>Thanks for use our service <3 </p>
        //         `
        //     })});
        // await Promise.all(borrowals)

    } catch (error) {
        next(error.status(500))
    }
 

});


// sendMail({
//     email: newUser.email,
//     subject: 'Thông báo từ ethnic group library',
//     html:`
//         <p>Hello,<strong>${newUser.name}</strong></p><br>
//         <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for use our service <3 </p>
//     `
//   });