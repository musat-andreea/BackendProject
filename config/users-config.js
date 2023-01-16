// mongodb://cloud_user:cloud_pass@mongo:27017/?authSource=admin"

module.exports = {
    APPLICATION_PORT: process.env.APPLICATION_PORT || 3000,
    MONGO_IP: process.env.MONGO_IP || "mongo",
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER || "cloud_user",
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || "cloud_pass",
    REDIS_URL: process.env.REDIS_URL || "redis",
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    SESSION_SECRET: process.env.SESSION_SECRET || "secret"
}