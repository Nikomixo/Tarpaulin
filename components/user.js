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