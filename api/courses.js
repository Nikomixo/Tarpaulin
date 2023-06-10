const { Router } = require('express');

const router = Router();

/*
 * GET /courses - Returns the list of all Courses. 
 * This list should be paginated.  
 * The Courses returned should not contain the list of students in the Course or the list of Assignments for the Course.
 */
router.get('/', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
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
router.post('/', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * GET /courses/{id} - Unique ID of a Course.  Exact type/format will depend on your implementation but will likely be either an integer or a string.
 */
router.get('/:id', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
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
router.patch('/:id', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
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
router.delete('/:id', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
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
router.get('/:id/students', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
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
router.post('/:id/students', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
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
router.get('/:id/roster', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

/*
 * GET /courses/{id}/students - Returns a list containing the Assignment IDs of all Assignments for the Course.  
 */
router.get('/:id/assignments', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        });
    }
});

module.exports = router;