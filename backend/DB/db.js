import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// connection string
const uri = process.env.MONGODB_URI;

// make Mongoose less strict with queries (optional)
mongoose.set('strictQuery', false);

// ✅ Use mongoose.connect (not createConnection) for app-wide connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    return mongoose.connection; // ✅ so Jest can close it after tests
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
