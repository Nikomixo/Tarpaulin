const { extractValidFields } = require('../lib/validation');
const bcrypt = require('bcryptjs');

const db = require('../lib/connection');

const UserSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true }
}
exports.UserSchema = UserSchema;

const UserLoginSchema = {
    email: { required: true },
    password: { required: true }
}
exports.UserLoginSchema = UserLoginSchema

async function checkIfEmailExists(email) {
    const [results] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )
    console.log(`email: ${email}, results: ${results.length > 0}`);
    return results.length > 0;
}
exports.checkIfEmailExists = checkIfEmailExists;

async function insertNewUser(user) {
    const validatedUser = extractValidFields(
        user,
        UserSchema
    );

    validatedUser.password = await bcrypt.hash(validatedUser.password, 8);

    console.log(validatedUser);

    const [results] = await db.query(
        "INSERT INTO users SET ?",
        validatedUser
    );
    return results.insertId;
}
exports.insertNewUser = insertNewUser;

async function validateUser(email, password) {
    const [result] = await db.query(
        "SELECT password FROM users WHERE email = ?",
        [email]
    );
    try {
        console.log("password:\n", result[0].password);
        authenticated = await bcrypt.compare(password, result[0].password);
        return authenticated;
    } catch (err) {
        return false;
    }
}
exports.validateUser = validateUser;

async function getUserFromEmail(email) {
    const [results] = await db.query(
        "SELECT id, role FROM users WHERE email = ?",
        [email]
    );
    return results[0];
}
exports.getUserFromEmail = getUserFromEmail;