const jwt = require("jsonwebtoken");
const ErrorWrapper = require("../utils/ErrorWrapper");
const ErrorHandler = require("../utils/ErrorHandle");

module.exports = ErrorWrapper(async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        throw new ErrorHandler(401, "Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new ErrorHandler(401, "Unauthorized: Invalid token");
    }


});

