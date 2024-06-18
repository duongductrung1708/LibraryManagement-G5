const initMiddleware = (app) => {
    const myLogger = function (req, res, next) {
        console.log(req.cookies)
        console.log('LOGGED')
        next()
    }
    
    app.use('/', myLogger)
}

module.exports=initMiddleware