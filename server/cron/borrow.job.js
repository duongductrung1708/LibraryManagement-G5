var cron = require('node-cron');
const sendMail = require('../middleware/sendmaiil');
const db = require('../models');
const Borrowal = db.borrowal;
const Review = db.review;

const User = db.user;

cron.schedule('0 0 * * *', async (next) => {
    try {
        const warningEmail = new Set();
        const dueEmail = new Set();
        // create time for send mail due date
        const twoDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 2 ngày tính bằng milliseconds
        // create present time
        const nowUTC = new Date().getTime();
        //take borrow
        const borrowals = await Borrowal.find({}).populate('memberId')

        await borrowals.map(borrowal => {
            if(borrowal && borrowal.memberId && borrowal.memberId.email && borrowal.dueDate){

                const nowDate = new Date(nowUTC);
                const nowDateStr = nowDate.toISOString().slice(0, 10);
                const warningDate = new Date(borrowal.dueDate-twoDaysInMillis);
                const warningDateStr = warningDate.toISOString().slice(0, 10); 
                const dueDate = new Date(borrowal.dueDate-twoDaysInMillis);
                const dueDateStr = dueDate.toISOString().slice(0, 10); 
                if (nowDateStr == warningDateStr) {
                    warningEmail.add(borrowal.memberId.email +" "+ borrowal.memberId.name);
                } else if (dueDateStr == nowDate) {
                    dueEmail.add(borrowal.memberId.email +" "+ borrowal.memberId.name);
                }
            }
        })
        if(warningEmail){
            const sendWarningPromises = Array.from(emailSet).map(email => {
                console.log(email)
                const userData = email.split(" ")
                sendMail({
                    email: userData[0],
                    subject: 'Thông báo từ ethnic group library: dến hạn trả sách!',
                    html: `
                        <p>Hello,<strong>${userData[1]}</strong></p><br>
                        <p>You need to return the book within <span style="color: blue; font-weight: bold;">7 days</span>. <br>Thanks for use our service <3 </p>
                        <span style="color: red; font-weight: bold;">warning: nếu không trả đúng hạn bạn sẽ bị phat</span> <span style="color: blue; font-weight: bold;">70.000 VND</span>
                    `
                });
            })
            Promise.all(sendWarningPromises)
        }
        
        if(dueEmail){
            const sendDuePromises = Array.from(emailSet).map(email => {
                console.log(email)
                const userData = email.split(" ")
                sendMail({
                    email: userData[0],
                    subject: 'Thông báo từ ethnic group library: quá hạn trả sách!',
                    html: `
                        <p>Hello,<strong>${userData[1]}</strong></p><br>
                        <p>You need to return the book early because you are overdue. <br> According to library policy, you will be fined <span style="color: blue; font-weight: bold;">70.000 VND</span> <br>Thanks for use our service <3 </p>
                        <span style="color: red; font-weight: bold;">warning: You need return the book early before u got ban out our service</span>
                    `
                });
            })
            Promise.all(sendDuePromises)
        }

    } catch (error) {
        console.log(error)
        next(error)
    }

});


