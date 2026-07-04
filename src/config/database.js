import mongoose from 'mongoose';

const connectDB = async (dburl) => {
  try {
    const conn = await mongoose.connect(dburl);
    console.log(`MongoDB connected successfully`);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
