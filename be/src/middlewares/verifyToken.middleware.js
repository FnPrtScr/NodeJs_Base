const asyncHandler = require('../utils/async-handler');
const jwt = require("jsonwebtoken");
const { ACCESS_KEY } = process.env;

const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        try {
            const user = jwt.verify(accessToken, ACCESS_KEY);
            // console.log(user);
            req.user = user;
            next();
        } catch (err) {
            return res.status(403).json("Token is not valid");
        }
    } else {
        return res.status(401).json("You are not authenticated");
    }
});

// check user có phải admin không
const verifyTokenAdmin = asyncHandler(async (req, res, next) => {
    await verifyToken(req, res, () => {
        if (req.user.admin) {
            next();
        } else {
            return res.status(403).json("You are not an Admin");
        }
    });

});

module.exports = {
    verifyToken,
    verifyTokenAdmin
};
