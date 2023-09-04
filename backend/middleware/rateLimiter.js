const Redis = require("ioredis");

const redisClient = new Redis();

redisClient.on("ERROR", (err) => console.log("Redis Error", err));

const MAX_BUCKET_SIZE = 100;
//1 minute = 60000 milliseconds
const REFILL_RATE_IN_MILLISECONDS = 60000;

const rateLimiter = async (req, res, next) => {
  try {
    const user = await redisClient.get(req.ip);
    const currentRequestTime = new Date();

    if (user == null) {
      let newRecord = [];
      let requestLog = {
        lastRefill: currentRequestTime,
        bucketSize: MAX_BUCKET_SIZE - 1,
      };
      newRecord.push(requestLog);
      await redisClient.set(req.ip, JSON.stringify(newRecord));
      next();
      return;
    }

    let data = JSON.parse(user);
    let lastRequestLog = data[data.length - 1];
    let currentBucketSize = lastRequestLog.bucketSize;
    let refillTime = new Date(currentRequestTime - REFILL_RATE_IN_MILLISECONDS);

    if (currentBucketSize <= 0) {
      if (
        new Date(lastRequestLog.lastRefill).getTime() <
        new Date(refillTime).getTime()
      ) {
        data.push({
          lastRefill: currentRequestTime,
          bucketSize: MAX_BUCKET_SIZE - 1,
        });
      }
      await redisClient.set(req.ip, JSON.stringify(data));
      res
        .status(429)
        .json(
          "You have exceeded " + MAX_BUCKET_SIZE + " requests in a 1 minute limit"
        );
    } else {
      lastRequestLog.bucketSize--;
      data[data.length - 1] = lastRequestLog;
      await redisClient.set(req.ip, JSON.stringify(data));
      next();
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports = rateLimiter;
