const redis = require('redis');
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT || '6379';
const rateLimitWindowMilliseconds = 60000;
const rateLimitWindowMaxRequests = 5;

const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});
exports.redisClient = redisClient;

async function rateLimit(req, res, next) {
    let tokenBucket;
    try {
        tokenBucket = await redisClient.hGetAll(req.ip);
    } catch(err) {
        next();
        return;
    }
    tokenBucket = {
        tokens: parseFloat(tokenBucket.tokens) || rateLimitWindowMaxRequests,
        last: parseInt(tokenBucket.last) || Date.now()
    }

    const timestamp = Date.now();
    const elapsedMilliseconds = timestamp - tokenBucket.last;

    const refreshRate = rateLimitWindowMaxRequests / rateLimitWindowMilliseconds;

    tokenBucket.tokens += elapsedMilliseconds * refreshRate;
    tokenBucket.tokens = Math.min(rateLimitWindowMaxRequests, tokenBucket.tokens);

    tokenBucket.last = timestamp;

    if (tokenBucket.tokens >= 1) {
        tokenBucket.tokens -= 1;
        await redisClient.hSet(req.ip, [
            ['tokens', tokenBucket.tokens],
            ['last', tokenBucket.last]
        ])
        next();
    } else {  
        await redisClient.hSet(req.ip, [
            ['tokens', tokenBucket.tokens],
            ['last', tokenBucket.last]
        ])
        res.status(429).json({
            error: "Too many requests per minute"
        }); 
    }    
}
exports.rateLimit = rateLimit;  