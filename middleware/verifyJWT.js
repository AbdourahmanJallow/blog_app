const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const verifyJWT = (req, res, next) => {
    const authHeaders =
        req?.headers?.Authorization || req?.headers?.authorization;
    if (!authHeaders?.startsWith('Bearer '))
        return res.sendStatus(StatusCodes.UNAUTHORIZED);

    // Grab access token from authorization header
    const token = authHeaders.split(' ')[1];
    try {
        // verify access token and decode it
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(StatusCodes.FORBIDDEN);
            console.log('Decoded token');
            console.log(decoded);

            req.email = decoded?.userInfo?.email;
            req.roles = decoded?.userInfo?.roles;
            req.userID = decoded?.userInfo?.userID;

            next();
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = verifyJWT;
