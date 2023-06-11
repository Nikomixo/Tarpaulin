const db = require('../lib/connection');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');

const CourseSchema = {
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructorId: { required: true }
}
exports.CourseSchema = CourseSchema;

async function checkIfInstructorTeachesCourse(instructorId, courseId) {
    const [results] = await db.query(
        'SELECT * FROM courses WHERE id = ?',
        [ courseId ],
    );
    newid = results[0]["instructorid"];
    return instructorId == newid;
}
exports.checkIfInstructorTeachesCourse = checkIfInstructorTeachesCourse;

async function getCourseById(courseId) {
    const [results] = await db.query(
        'SELECT * FROM courses WHERE id = ?',
        [ courseId ],
    );
    return results[0];
}
exports.getCourseById = getCourseById;