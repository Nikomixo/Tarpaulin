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
    return instructorId == results[0]["instructorid"];
}
exports.checkIfInstructorTeachesCourse = checkIfInstructorTeachesCourse;