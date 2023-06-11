const jwt = require('jsonwebtoken');

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
if (!secretKey) throw new Error("No JWT secretKey found in .env");

/**
 * 
 * @param {int} userid 
 * @param {string} role 
 * @returns {string} JWT token
 * 
 * generate JWT auth token
 */
function generateAuthToken(userid, role) {
    const payload = { sub: userid, role: role };
    // console.log(`JWT payload: ${payload}`);
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}

/**
 * 
 * @param {*} allowedRoles list<string> of allowed roles
 * @returns 
 * 
 * middleware function to authenticate JWT
 *      sets req.user to userid
 *      sets req.role to role
 */
const authenticateRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.get('Authorization') || '';
        const authHeaderParts = authHeader.split(' ');

        const token = authHeaderParts[0] == 'Bearer' ? authHeaderParts[1] : null;

        // console.log(token);

        if (allowedRoles.includes("") && !token) {
            req.user = null;
            req.role = null;
            next();
        } else {
            try {
                const payload = jwt.verify(token, secretKey);
                req.user = payload.sub;
                req.role = payload.role;

                if (!allowedRoles.includes(req.role)) {
                    res.status(403).json({
                        error: "Unauthorized to access the specified resource"
                    });
                } else {
                    next();
                }
            } catch (err) {
                res.status(401).json({
                    error: "Invalid authentication token provided."
                });
            }
        }
    }
}

exports.generateAuthToken = generateAuthToken;
exports.authenticateRole = authenticateRole;

const admin_token = generateAuthToken(2, "admin")
const instructor_token = generateAuthToken(3, "instructor")
const student_token = generateAuthToken(1, "student")

console.log(`admin token:\n${admin_token}`);
console.log(`instructor token:\n${instructor_token}`);
console.log(`student token:\n${student_token}`);