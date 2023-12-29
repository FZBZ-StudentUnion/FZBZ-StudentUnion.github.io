let checkLoginMiddleware = (req, res, next)=>{
    if (!req.session.tel){
        res.redirect('/login');
    }
    next();
}

module.exports = checkLoginMiddleware;
