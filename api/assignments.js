const { Router } = require('express');
const { authenticateRole } = require('../lib/auth');
const { getAssignmentById, insertNewAssignment, updateAssignment, deleteAssignment, AssignmentSchema } = require('../components/assignment');
const { checkIfInstructorTeachesCourse } = require('../components/course');
const { validateAgainstSchema } = require('../lib/validation');
const {
    upload,
    SubmissionSchema,
    insertNewSubmission,
    checkStudentInCourse,
    getSubmissionFileById,
    getSubmissionPage
} = require('../components/submission');

const router = Router();

/*
 * POST /assignments - Create and store a new Assignment with specified data and adds it to the application's database.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can create an Assignment.
 */
router.post('/', authenticateRole(["admin", "instructor"]), async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, AssignmentSchema)) {
            if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, req.body.courseId)) {
                const id = await insertNewAssignment(req.body);
                res.status(201).send({ id: id });
            } else {
                res.status(403).json({
                    error: "Unauthorized to access the specified resource"
                });
            }
        } else {
            res.status(400).json({
                error: "Request body is not a valid assignment object"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * GET /assignments/{id} - Returns summary data about the Assignment, excluding the list of Submissions.
 */
router.get('/:id', async (req, res, next) => {
    try {
        const assignment = await getAssignmentById(req.params.id);
        if (assignment) {
            res.status(200).send(assignment);
        } else {
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * PATCH /assignments/{id} - Performs a partial update on the data for the Assignment.  Note that submissions cannot be modified via this endpoint.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can update an Assignment.
 */
router.patch('/:id', authenticateRole(["admin", "instructor"]), async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, AssignmentSchema)) {
            if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, req.body.courseId)) {
                await updateAssignment(req.body, req.params.id);
                res.status(200).send({});
            } else {
                res.status(403).json({
                    error: "Unauthorized to access the specified resource"
                });
            }
        } else {
            res.status(400).json({
                error: "Request body is not a valid assignment object"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * DELETE /assignments/{id} - Completely removes the data for the specified Assignment, including all submissions.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can delete an Assignment.
 */
router.delete('/:id', authenticateRole(["admin", "instructor"]), async (req, res, next) => {
    try {
        const assignment = await getAssignmentById(req.params.id);
        if (!assignment) {
            next();
        } else if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, assignment["courseid"])) {
            const sucessful = await deleteAssignment(req.params.id);
            if (sucessful) {
                res.status(204).send({});
            } else {
                next();
            }
        } else {
            res.status(403).json({
                error: "Unauthorized to access the specified resource"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * GET /assignments/{id}/submissions - Returns the list of all Submissions for an Assignment.  This list should be paginated.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can fetch the Submissions for an Assignment.
 */
router.get('/:id/submissions', authenticateRole(["admin", "instructor"]), async (req, res, next) => {
    try {
        const assignment = await getAssignmentById(req.params.id);
        console.log(assignment)
        if (!assignment) {
            next();
        } else if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, assignment["courseid"])) {
            let page = parseInt(req.query.page) || 1;
            let studentid = parseInt(req.query.studentId) || -1;
            const submissionsPage = await getSubmissionPage(page, req.params.id, studentid);
            res.status(200).send(submissionsPage);
        } else {
            res.status(403).json({
                error: "Unauthorized to access the specified resource"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * POST /assignments/{id}/submissions - Create and store a new Assignment with specified data and adds it to the application's database.  
 * Only an authenticated User with 'student' role who is enrolled in the Course corresponding to the Assignment's `courseId` can create a Submission. 
 */
router.post(
    '/:id/submissions',
    authenticateRole(["student"]),
    checkStudentInCourse,
    upload.single('file'),
    (err, req, res, next) => {
        console.log(err);
        res.status(500).send({
            err: "An error occurred. Try again later."
        });
    },
    async (req, res) => {
        if (validateAgainstSchema(req.body, SubmissionSchema) && req.file) {
            try {
                const submission = {
                    timestamp: req.body.timestamp,
                    filepath: req.file.path,
                    studentid: req.user,
                    assignmentid: req.params.id
                }

                let id = await insertNewSubmission(submission);
                res.status(201).send({
                    'assignmentId': req.params.id,
                    'studentId': req.user,
                    'timestamp': req.body.timestamp,
                    'grade': null,
                    'file': `/assignments/submissions/${id}`
                })
            } catch (err) {
                console.error(err);
                res.status(500).send({
                    error: `An internal server error occurred in ${req.originalUrl}.`
                });
            }
        } else {
            res.status(400).send({
                error: "The request body was either not present or did not contain all of the required fields."
            })
        }
    }
);

/*
 * GET /assignments/submissions/{id} - Downloadable link for said file.
 */
router.get('/submissions/:id', async (req, res) => {
    const file = await getSubmissionFileById(req.params.id);
    if (file != "") {
        res.status(200).download(file.filepath);
    } else {
        res.status(404).send({
            error: 'File not found.'
        })
    }
});

module.exports = router;