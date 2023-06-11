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

async function insertNewCourse(course) {
    const validatedCourse = extractValidFields(course, CourseSchema);
    const [result] = await db.query(
        'INSERT INTO courses SET ?',
        [ validatedCourse ],
    );
    return result.insertId;
}
exports.insertNewCourse = insertNewCourse;

async function getCoursePage(page, subject, number, term) {
    var sql = "";
    var sum = 0;
    if (subject) {
        sum = sum+1;
        sql = sql + " subject='" + subject + "'";
    }
    if (number) {
        if (sum > 0) {
            sql = sql + " AND"
        }
        sum = sum+1;
        sql = sql + " number='" + number+ "'";
    }
    if (term) {
        if (sum > 0) {
            sql = sql + " AND"
        }
        sum = sum+1;
        sql = sql + " term='" + term + "'";
    }
    if (sum > 0) {
        sql = " WHERE" + sql;
    }

    count = await db.query("SELECT COUNT(id) FROM courses" + sql);
    count = count[0][0]['COUNT(id)']

    if (!page) {
        page = 1;
    }
    const pageSize = 10;
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;

    sql = "SELECT * FROM courses" + sql + " LIMIT " + pageSize + " OFFSET " + offset;
    const [results] = await db.query(sql);
    
    return {
        courses: results,
        page: page,
        totalPages: lastPage,
        pageSize: pageSize,
    };
}
exports.getCoursePage = getCoursePage;