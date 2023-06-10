const { Router } = require('express');
const { authenticateRole } = require('../lib/auth');

const router = Router();

/*
 * POST /assignments - Create and store a new Assignment with specified data and adds it to the application's database.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can create an Assignment.
 */
router.post('/', authenticateRole(["admin", "instructor"]), (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        })
    }
});

/*
 * GET /assignments/{id} - Returns summary data about the Assignment, excluding the list of Submissions.
 */
router.get('/:id', (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        })
    }
});

/*
 * PATCH /assignments/{id} - Performs a partial update on the data for the Assignment.  Note that submissions cannot be modified via this endpoint.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can update an Assignment.
 */
router.patch('/:id', authenticateRole(["admin", "instructor"]), (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        })
    }
});

/*
 * DELETE /assignments/{id} - Completely removes the data for the specified Assignment, including all submissions.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can delete an Assignment.
 */
router.delete('/:id', authenticateRole(["admin", "instructor"]), (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        })
    }
});

/*
 * GET /assignments/{id}/submissions - Returns the list of all Submissions for an Assignment.  This list should be paginated.  
 * Only an authenticated User with 'admin' role or an authenticated 'instructor' User whose ID matches the `instructorId` of the Course corresponding to the Assignment's `courseId` can fetch the Submissions for an Assignment.
 */
router.get('/:id/submissions', authenticateRole(["admin", "instructor"]), (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        })
    }
});

/*
 * POST /assignments/{id}/submissions - Create and store a new Assignment with specified data and adds it to the application's database.  
 * Only an authenticated User with 'student' role who is enrolled in the Course corresponding to the Assignment's `courseId` can create a Submission. 
 */
router.post('/:id/submissions', authenticateRole(["student"]), (req, res) => {
    try {
        //TODO
        res.status(200).send(req.originalUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            error: `An internal server error occurred in ${req.originalUrl}.`
        })
    }
});

module.exports = router;