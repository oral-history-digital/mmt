const authTokens = require('./authTokens');

module.exports = function injectUser(req, res, next) {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];
    res.locals.signedIn = req.user ? true : false;

    next();
};
