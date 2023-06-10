const mysqlPool = require('../lib/connection');

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
    const [results] = await mysqlPool.query(
        'SELECT * FROM assignments WHERE id = ?',
        [ assignmentId ],
    );
    return results[0];
}
exports.getAssignmentById= getAssignmentById;