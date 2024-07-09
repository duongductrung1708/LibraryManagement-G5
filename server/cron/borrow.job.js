var cron = require('node-cron');
const sendMail = require('../helpers/sendmaiil');
const status = require("../models/enum")

const db = require('../models');
const Borrowal = db.borrowal;
const User = db.user;

cron.schedule('0 0 * * *', async (next) => {
    try {
        const warningWeekEmail = new Set();
        const warningDayEmail = new Set();
        const dueEmail = new Set();
        const banEmail = new Set();
        // create time for send mail due date
        const weekInMillis = 7 * 24 * 60 * 60 * 1000; // 2 ngày tính bằng milliseconds
        const oneDayInMillis = 1 * 24 * 60 * 60 * 1000; // 2 ngày tính bằng milliseconds
        // create present time
        const nowUTC = new Date().toISOString().slice(0, 10);
        //take borrow
        const borrowals = await Borrowal.find({}).populate('memberId')
        await borrowals.map(async borrowal => {
            if(borrowal && borrowal.memberId &&  borrowal.memberId.status == status.UserType.ACTIVE&& borrowal.memberId.email && borrowal.dueDate){
                const warningWeek = new Date(borrowal.dueDate-weekInMillis).toISOString().slice(0, 10);
                const warningDay= new Date(borrowal.dueDate-oneDayInMillis).toISOString().slice(0, 10);
                const dueDate = new Date(borrowal.dueDate).toISOString().slice(0, 10);
                if (nowUTC == warningWeek) {
                    warningWeekEmail.add(borrowal.memberId.email +" "+ borrowal.memberId.name);
                }else if (nowUTC == warningDay) {
                    warningDayEmail.add(borrowal.memberId.email +" "+ borrowal.memberId.name);
                } else if (dueDate == nowUTC) {
                    if(borrowal.memberId.totalOverDue == 3){
                        const user = await User.findById(borrowal.memberId)
                        user.status = status.UserType.DEACTIVE
                        user.save()
                        banEmail.add(borrowal.memberId.email +" "+ borrowal.memberId.name);
                    }else{     
                        const user = await User.findById(borrowal.memberId)
                        user.totalOverDue = borrowal.memberId.totalOverDue+1
                        user.save()
                        dueEmail.add(borrowal.memberId.email +" "+ borrowal.memberId.name);
                    }
                }
            }
        })

        if(warningWeekEmail){
            Array.from(warningWeekEmail).map(email => {
                const userData = email.split(" ")
                sendMail({
                    email: userData[0],
                    subject: 'Thông báo từ ethnic group library: dến hạn trả sách còn 1 tuần!',
                    html: `
                        <p>Hello,<strong>${userData[1]}</strong></p><br>
                        <p>You need to return the book within <span style="color: blue; font-weight: bold;">7 days</span>. <br>Thanks for use our service <3 </p>
                        <span style="color: red; font-weight: bold;">warning: nếu không trả đúng hạn bạn sẽ bị phat</span> <span style="color: blue; font-weight: bold;">70.000 VND</span>
                    `
                });
            })
            // Promise.all(sendWarningPromises)
        }

        if(warningDayEmail){
            Array.from(warningDayEmail).map(email => {
                const userData = email.split(" ")
                sendMail({
                    email: userData[0],
                    subject: 'Thông báo từ ethnic group library: dến hạn trả sách còn 1 ngày!',
                    html: `
                        <p>Hello,<strong>${userData[1]}</strong></p><br>
                        <p>You need to return the book within <span style="color: blue; font-weight: bold;">1 days</span>. <br>Thanks for use our service <3 </p>
                        <span style="color: red; font-weight: bold;">warning: nếu không trả đúng hạn bạn sẽ bị phat</span> <span style="color: blue; font-weight: bold;">70.000 VND</span>
                    `
                });
            })
            // Promise.all(sendWarningPromises)
        }
        
        if(dueEmail){
            Array.from(dueEmail).map(email => {
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
            // Promise.all(sendDuePromises)
        }

         if(banEmail){
            Array.from(banEmail).map(email => {
                const userData = email.split(" ")
                sendMail({
                    email: userData[0],
                    subject: 'Thông báo từ ethnic group library: bạn đã bị ngừng sử dụng dịch vụ!!',
                    html: `
                        <p>Hello,<strong>${userData[1]}</strong></p><br>
                        <p>You got 3 times expired return book. <br> According to library policy, you will got ban <br>Thanks for use our service <3 </p>
                        <span style="color: red; font-weight: bold;">warning: If You wanna <span style="color: blue; font-weight: bold;">Active</span> your account, u need meet librian or admin</span>
                    `
                });
            })
            // Promise.all(sendDuePromises)
        }

    } catch (error) {
        next(error)
    }

});


