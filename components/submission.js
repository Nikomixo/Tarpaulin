const db = require('../lib/connection');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const multer = require('multer');
const crypto = require('crypto');

const SubmissionSchema = {
    studentId: { required: true },
    timestamp: { required: true },
}
exports.SubmissionSchema = SubmissionSchema

//hardcoded list of supported mimetypes
const fileTypes = {
    'text/plain': 'txt',
    'text/json': 'json',
    'text/csv': 'csv',
    'image/bmp': 'bmp',
    'image/gif': 'gif',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'application/msword': 'doc',
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
}

async function getSubmissionFileById(id) {
    const [results] = await db.query(
        "SELECT * FROM submissions WHERE id = ?",
        id
    );
    console.log(results)

    return results.length > 0 ? results[0] : "";
}
exports.getSubmissionFileById = getSubmissionFileById

async function insertNewSubmission(submission) {
    const [results] = await db.query(
        "INSERT INTO submissions SET ?",
        submission
    );

    return results.insertId;
}
exports.insertNewSubmission = insertNewSubmission;

//checking if student is in course related to assignment
async function checkStudentInCourse(req, res, next) {
    const [assignments] = await db.query(
        "SELECT courseid FROM assignments WHERE id = ?",
        [req.params.id]
    )

    if (assignments.length > 0) {
        const [results] = await db.query(
            "SELECT * FROM userscourses WHERE userid = ? AND courseid = ?",
            [req.user, assignments[0]['courseid']]
        )
        if (results.length > 0) {
            next()
        } else {
            res.status(403).send({
                error: "The request was not made by a student taking this course."
            })
        }
    } else {
        res.status(404).send({
            error: "Assignment not found."
        })
    }
}
exports.checkStudentInCourse = checkStudentInCourse;

// upload middleware function
const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/uploads`,
        filename: (req, file, callback) => {
            const filename = crypto.pseudoRandomBytes(16).toString('hex');
            const extension = fileTypes[file.mimetype];
            callback(null, `${filename}.${extension}`);
        }
    }),
    fileFilter: (req, file, callback) => {
        console.log(file.mimetype);
        callback(null, !!fileTypes[file.mimetype]);
    }
});
exports.upload = upload;
