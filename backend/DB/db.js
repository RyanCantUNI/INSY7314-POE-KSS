import mongoose from 'mongoose';

// connection string
const uri = process.env.MONGODB_URI;

// connect to database
export const connectToDatabase = async () => {
  try {
    // Note: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; // Re-throw to allow proper error handling
  }
};
