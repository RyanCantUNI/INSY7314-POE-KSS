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
    const db = await mongoose.connect(uri, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,

    }).then(
      () => {
        console.log('Connected to MongoDB');
      },
      (error) => {
        console.error('Error connecting to MongoDB:', error);
      }
    )
    
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
