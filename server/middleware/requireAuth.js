module.exports = function requireAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).json({message: 'not allowed'});
    }
};
