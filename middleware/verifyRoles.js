const { StatusCodes } = require('http-status-codes');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.roles) return res.sendStatus(StatusCodes.UNAUTHORIZED);

            const roles = Object.values(req.roles);
            console.log('roles ' + roles);

            const rolesArray = [...allowedRoles];
            const result = roles
                .map((role) => rolesArray.includes(role))
                .find((value) => value === true);

            console.log('Inside verifyRoles');
            console.log('result: ' + result);

            if (!result) return res.sendStatus(StatusCodes.FORBIDDEN);

            next();
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        }
    };
};

module.exports = verifyRoles;
