const { Router } = require('express');
const { authenticateRole } = require('../lib/auth');
const { CourseSchema, checkIfInstructorTeachesCourse, getCourseById, insertNewCourse, getCoursePage, updateCourse, deleteCourse, getStudentsInCourse, AddOrRemoveStudentsSchema, addStudentsToCourse, removeStudentsFromCourse, getRosterForCourse } = require('../components/course');
const { getAssignmentsInCourse } = require('../components/assignment');
const { validateAgainstSchema } = require('../lib/validation');
const router = Router();

/*
 * GET /courses - Returns the list of all Courses. 
 * This list should be paginated.  
 * The Courses returned should not contain the list of students in the Course or the list of Assignments for the Course.
 */
router.get('/', async (req, res) => {
    try {
        const coursePage = await getCoursePage(req.query.page, req.query.subject, req.query.number, req.query.term);
        if (coursePage) {
            var querystring = "";
            if (req.query.subject) {
                querystring = querystring + "&subject=" + req.query.subject;
            }
            if (req.query.number) {
                querystring = querystring + "&number=" + req.query.number;
            }
            if (req.query.term) {
                querystring = querystring + "&term=" + req.query.term;
            }
            coursePage.links = {}
            if (coursePage.page < coursePage.totalPages) {
                coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}${querystring}`;
                coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}${querystring}`;
            }
            if (coursePage.page > 1) {
                coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}${querystring}`;
                coursePage.links.firstPage = `/courses?page=1${querystring}`;
            }
            res.status(200).send(coursePage);
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
 * POST /courses - Creates a new Course with specified data and adds it to the application's database.  
 * Only an authenticated User with 'admin' role can create a new Course.
 */
router.post('/', authenticateRole(["admin"]), async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, CourseSchema)) {
            const id = await insertNewCourse(req.body);
            res.status(201).send({ id: id });
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
 * GET /courses/{id} - Returns summary data about the Course, excluding the list of students enrolled in the course and the list of Assignments for the course.
 */
router.get('/:id', async (req, res) => {
    try {
        const course = await getCourseById(req.params.id);
        if (course) {
            res.status(200).send(course);
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
 * PATCH /courses/{id} - Performs a partial update on the data for the Course.  Note that enrolled students and assignments cannot be modified via this endpoint.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can update Course information.
 */
router.patch('/:id', authenticateRole(["admin", "instructor"]), async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, CourseSchema)) {
            if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, req.params.id)) {
                await updateCourse(req.body, req.params.id);
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
 * DELETE /courses/{id} - Completely removes the data for the specified Course, including all enrolled students, all Assignments, etc.  
 * Only an authenticated User with 'admin' role can remove a Course.
 */
router.delete('/:id', authenticateRole(["admin"]), async (req, res) => {
    try {
        const sucessful = await deleteCourse(req.params.id);
        if (sucessful) {
            res.status(204).send({});
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
 * GET /courses/{id}/students - Returns a list containing the User IDs of all students currently enrolled in the Course.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId`
 */
router.get('/:id/students', authenticateRole(["admin", "instructor"]), async (req, res) => {
    try {            
        if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, req.params.id)) {
            students = await getStudentsInCourse(req.params.id);
            res.status(200).send(students);
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
 * POST /courses/{id}/students - Enrolls and/or unenrolls students from a Course.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can update the students enrolled in the Course. 
 */
router.post('/:id/students', authenticateRole(["admin", "instructor"]), async (req, res) => {
    try {
        if (validateAgainstSchema(req.body, AddOrRemoveStudentsSchema)) {
            if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, req.params.id)) {
                await addStudentsToCourse(req.params.id, req.body.add);
                await removeStudentsFromCourse(req.params.id, req.body.remove);
                res.status(200).send({});
            } else {
                res.status(403).json({
                    error: "Unauthorized to access the specified resource"
                });
            }
        } else {
            res.status(400).json({
                error: "Request body is not valid"
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
 * GET /courses/{id}/students - Returns a CSV file containing information about all of the students currently enrolled in the Course, including names, IDs, and email addresses.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course can fetch the course roster.  
 */
router.get('/:id/roster', authenticateRole(["admin", "instructor"]), async (req, res) => {
    try {
        if (req.role == "admin" || await checkIfInstructorTeachesCourse(req.user, req.params.id)) {
            results = await getRosterForCourse(req.params.id);
            res.type('text/csv');
            res.status(200).send(results);
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
 * GET /courses/{id}/assignments - Returns a list containing the Assignment IDs of all Assignments for the Course.  
 */
router.get('/:id/assignments', async (req, res) => {
    try {
        results = await getAssignmentsInCourse(req.params.id);
        res.status(200).send(results);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

module.exports = router;