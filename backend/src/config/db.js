const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const connStr = process.env.MONGO_URI?.trim() ||
    (isProduction ? '' : 'mongodb://127.0.0.1:27017/careerfit');

  if (!connStr) {
    throw new Error('MONGO_URI is required in production. Set it in the Render backend environment.');
  }

  if (
    isProduction &&
    /^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?(?:localhost|127(?:\.\d+){3}|\[::1\])(?=[:/]|$)/i.test(connStr)
  ) {
    throw new Error('MONGO_URI points to localhost in production. Use a reachable MongoDB Atlas URI.');
  }

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    throw new Error(`MongoDB connection failed. Check MONGO_URI and Atlas network access. ${error.message}`);
  }
};

module.exports = connectDB;
