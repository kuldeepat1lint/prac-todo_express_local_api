const logger = (req, res, next) => {
    console.log(req.method,req.url,new Date().getTime());
    next()
}

module.exports = {logger}