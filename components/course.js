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

const AddOrRemoveStudentsSchema = {
    add: { required: true },
    remove: { required: true }
}
exports.AddOrRemoveStudentsSchema = AddOrRemoveStudentsSchema

async function checkIfInstructorTeachesCourse(instructorId, courseId) {
    console.log("courseid:", courseId)
    console.log("instructorid:", instructorId)
    const [results] = await db.query(
        'SELECT * FROM courses WHERE id = ?',
        [courseId],
    );
    console.log(results);
    newid = results[0]["instructorid"];
    return instructorId == newid;
}
exports.checkIfInstructorTeachesCourse = checkIfInstructorTeachesCourse;

async function getCourseById(courseId) {
    const [results] = await db.query(
        'SELECT * FROM courses WHERE id = ?',
        [courseId],
    );
    return results[0];
}
exports.getCourseById = getCourseById;

async function insertNewCourse(course) {
    const validatedCourse = extractValidFields(course, CourseSchema);
    const [result] = await db.query(
        'INSERT INTO courses SET ?',
        [validatedCourse],
    );
    return result.insertId;
}
exports.insertNewCourse = insertNewCourse;

async function getCoursePage(page, subject, number, term) {
    var sql = "";
    var sum = 0;
    if (subject) {
        sum = sum + 1;
        sql = sql + " subject='" + subject + "'";
    }
    if (number) {
        if (sum > 0) {
            sql = sql + " AND"
        }
        sum = sum + 1;
        sql = sql + " number='" + number + "'";
    }
    if (term) {
        if (sum > 0) {
            sql = sql + " AND"
        }
        sum = sum + 1;
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
    const pageSize = 3;
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

async function updateCourse(course, courseId) {
    const validatedCourse = extractValidFields(course, CourseSchema);
    const [result] = await db.query(
        'UPDATE courses SET ? WHERE id = ?',
        [validatedCourse, courseId],
    );
    return result.affectedRows > 0;
}
exports.updateCourse = updateCourse;

async function deleteCourse(courseId) {
    const [result] = await db.query(
        'DELETE FROM courses WHERE id = ?',
        [courseId]
    );
    return result.affectedRows > 0;
}
exports.deleteCourse = deleteCourse;

async function getStudentsInCourse(courseId) {
    const [results] = await db.query(
        'SELECT userid FROM userscourses WHERE courseid = ?',
        [courseId]
    );
    formattedResults = [];
    for (let i = 0; i < results.length; i++) {
        formattedResults.push(results[i]["userid"])
    }
    return formattedResults;
}
exports.getStudentsInCourse = getStudentsInCourse;

async function getRosterForCourse(courseId) {
    const [results] = await db.query(
        'SELECT u.id, u.name, u.email FROM users AS u, userscourses AS uc WHERE uc.courseid = ? AND u.id = uc.userid',
        [courseId]
    );
    formattedResults = "";
    for (let i = 0; i < results.length; i++) {
        formattedResults = formattedResults + results[i]["id"] + ", " + results[i]["name"] + ", " + results[i]["email"] + "\n";
    }
    return formattedResults;
}
exports.getRosterForCourse = getRosterForCourse;

async function addStudentsToCourse(courseId, students) {
    for (let i = 0; i < students.length; i++) {
        student = { "courseId": courseId, "userId": students[i] };
        const [results] = await db.query(
            'INSERT INTO userscourses SET ?',
            [student]
        );
    };
}
exports.addStudentsToCourse = addStudentsToCourse;

async function removeStudentsFromCourse(courseId, students) {
    for (let i = 0; i < students.length; i++) {
        const [results] = await db.query(
            'DELETE FROM userscourses WHERE userId = ? AND courseId = ?',
            [students[i], courseId]
        );
    };
}
exports.removeStudentsFromCourse = removeStudentsFromCourse;