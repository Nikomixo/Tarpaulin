const { Router } = require('express');
const { generateAuthToken, authenticateRole } = require('../lib/auth');
const router = Router();

/*
 * POST /users - Create and store a new application User with specified data and adds it to the application's database.  
 * Only an authenticated User with 'admin' role can create users with the 'admin' or 'instructor' roles.
 */
router.get('/', authenticateRole(["admin", "instructor", "student"]), (req, res) => {
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
 * POST /users/login - Authenticate a specific User with their email address and password.
 */
router.post('/login', (req, res) => {
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
 * GET /users/{id} - Returns information about the specified User.  
 * If the User has the 'instructor' role, the response should include a list of the IDs of the Courses the User teaches (i.e. Courses whose `instructorId` field matches the ID of this User).  
 * If the User has the 'student' role, the response should include a list of the IDs of the Courses the User is enrolled in.  
 * Only an authenticated User whose ID matches the ID of the requested User can fetch this information.
 */
router.get('/:id', authenticateRole(["admin", "instructor", "student"]), (req, res) => {
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