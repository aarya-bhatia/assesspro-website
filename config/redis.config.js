const redis = require("redis");

const REDIS_PORT = process.env.PORT || 6379;

// configure redis client

module.exports = redis.createClient(REDIS_PORT);
