var cron = require('node-cron');
const sendMail = require('../middleware/sendmaiil');
const db = require('../models');
const Borrowal = db.borrowal;
const User = db.user;

cron.schedule('*/2 * * * * *', () => {
    // sendMail({
    //     email: newUser.email,
    //     subject: 'Thông báo từ ethnic group library',
    //     html:`
    //         <p>Hello,<strong>${newUser.name}</strong></p><br>
    //         <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for use our service <3 </p>
    //     `
    //   });
    
    console.log('running every minute to 1 from 5');
  });