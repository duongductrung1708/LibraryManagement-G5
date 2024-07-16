const db = require('../models/index')
const User = db.user

const initMiddleware = {
    adminMiddle: async function (req, res, next) {
        const error = new Error();
        // try {
        //     console.log(req.session)
        //     if(req.session.passport.user.email ){
        //         console.log("11111")
        //         if(req.isAuthenticated()){
        //             console.log("22222222")
        //             if(req.session.passport.user.isAdmin == false && req.session.passport.user.isLibrarian == false){
        //                 console.log("3333333")
        //                 next()
        //             }
        //             error.message = "out of authority"
        //             error.status=500
        //             return next(error)
        //         }
        //         error.message = "Unauthorized"
        //         error.status=401
        //         return next(error)
        //     }
        //     error.message = "Forbidden"
        //     error.status = 404;
        // return next(error)
        // } catch (error) {
        try {
            const user = req.session.passport.user
            // if(user && )
            // console.log("11111")
            if (!user) {
                error.message = "Unauthorized";
                error.status = 401;
                return next(error);
            }

            if (req.session.passport.user.email !== user.email) {
                error.message = "Forbidden";
                error.status = 403;
                return next(error);
            }

            // if (!req.isAuthenticated()) {
            //     error.message = "Unauthorized";
            //     error.status = 401;
            //     return next(error);
            // }

            if (req.session.passport.user.isAdmin === true || req.session.passport.user.isLibrarian === true) {
                error.message = "Out of authority";
                error.status = 500;
                return next(error);
            }

            console.log("Authorized");
            return next(); // Người dùng có quyền hợp lệ, tiếp tục xử lý middleware tiếp theo

        } catch (err) {
            next(error)
        }

    },

    librianMiddle: function (req, res, next) {
        if (req.isAuthenticated() && req.session.passport.user.isAdmin == true || req.session.passport.user.librian == true) {
            next()
        }
    },

    memMiddle: function (req, res, next) {
        if (req.isAuthenticated() && req.session.passport.user.isAdmin == false && req.session.passport.user.librian == false) {
            next()
        }
    }
}
module.exports = initMiddleware












// const initMiddleware = (app) => {
//     const adminMiddle = function (req, res, next) {
//         const user =  User.findById(req.session.passport.user._id)
//         if(user.email !== req.session.passport.user.email){
//             next(404)
//         }
//         if(req.isAuthenticated() && req.session.passport.user.isAdmin == false && req.session.passport.user.librian == false){
//             next()
//         }
//     }

//     const librianMiddle = function (req, res, next) {
//         if(req.isAuthenticated() && req.session.passport.user.isAdmin == false && req.session.passport.user.librian == false){
//             next()
//         }
//     }

//     const memMiddle = function (req, res, next) {
//         if(req.isAuthenticated() && req.session.passport.user.isAdmin == false && req.session.passport.user.librian == false){
//             next()
//         }
//     }

//     app.use('/api/auth/register', adminMiddle)
//     app.use('/api/auth/register', librianMiddle)
//     app.use('/api/auth/register', memMiddle)
// }