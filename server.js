const express = require('express');
const api = require('./api');
const { redisClient, rateLimit } = require('./lib/ratelimiting');

require('dotenv').config();

app = express();
const port = process.env.PORT || 8000;

app.use(rateLimit);
app.use(express.json());
app.use(express.static('public'));

app.use('/', api);

app.use('*', function (req, res, next) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

redisClient.connect().then(function () {
    app.listen(port, function () {
        console.log("Server is running on port", port);
    });
});