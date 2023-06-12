const db = require('../lib/connection');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');

const AssignmentSchema = {
    courseId: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true },
}
exports.AssignmentSchema = AssignmentSchema;

const SubmissionSchema = {
    assignmentId: { required: true },
    studentId: { required: true },
    timestamp: { required: true },
    grade: { required: true },
    file: { required: true }
}
exports.SubmissionSchema = SubmissionSchema

async function getAssignmentById(assignmentId) {
    const [results] = await db.query(
        'SELECT * FROM assignments WHERE id = ?',
        [ assignmentId ],
    );
    return results[0];
}
exports.getAssignmentById = getAssignmentById;

async function insertNewAssignment(assignment) {
    const validatedAssignment = extractValidFields(assignment, AssignmentSchema);
    const [result] = await db.query(
        'INSERT INTO assignments SET ?',
        [ validatedAssignment ],
    );
    return result.insertId;
}
exports.insertNewAssignment= insertNewAssignment;

async function updateAssignment(assignment, assignmentId) {
    const validatedAssignment = extractValidFields(assignment, AssignmentSchema);
    const [result] = await db.query(
        'UPDATE assignments SET ? WHERE id = ?',
        [ validatedAssignment, assignmentId ],
    );
    return result.affectedRows > 0;
}
exports.updateAssignment= updateAssignment;

async function deleteAssignment(assignmentId) {
    const [ result ] = await db.query(
        'DELETE FROM assignments WHERE id = ?',
        [ assignmentId ]
    );
    return result.affectedRows > 0;
}
exports.deleteAssignment = deleteAssignment;

async function getAssignmentsInCourse(courseId) {
    const [results] = await db.query(
        'SELECT id FROM assignments WHERE courseid = ?',
        [ courseId ],
    );
    formattedResults = [];
    for (let i = 0; i < results.length; i++) {
        formattedResults.push(results[i]["id"])
    }
    return formattedResults;
}  
exports.getAssignmentsInCourse = getAssignmentsInCourse;