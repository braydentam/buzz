const mongoose = require("mongoose");

async function clearCollections() {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map(async (collection) => {
      await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
    })
  );
}

async function dbCleanup() {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await clearCollections();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
}

module.exports = dbCleanup;
