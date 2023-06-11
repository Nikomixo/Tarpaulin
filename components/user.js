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
    return results.length > 0;
}
exports.checkIfEmailExists = checkIfEmailExists;

async function userExists(id) {
    const [results] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
    )
    return results.length > 0;
}
exports.userExists = userExists;

async function insertNewUser(user) {
    const validatedUser = extractValidFields(
        user,
        UserSchema
    );

    validatedUser.password = await bcrypt.hash(validatedUser.password, 8);

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

async function getUserbyId(id) {
    const [user] = await db.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [id]
    );

    let res = {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
    };

    if (user[0].role == "instructor") {
        const [courses] = await db.query(
            "SELECT id FROM courses WHERE instructorid = ?",
            [id]
        );
        res["courses"] = courses.map(courses => courses.id);

    } else if (user[0].role == "student") {
        const [courses] = await db.query(
            "SELECT courseid FROM userscourses WHERE userid = ?",
            [id]
        );
        res["courses"] = courses.map(courses => courses.courseid);
    }

    return res;
}
exports.getUserbyId = getUserbyId;