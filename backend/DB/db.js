import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';



// connection string
const uri = process.env.MONGODB_URI;

// connect to database


mongoose.set("strictQuery", false);

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
    console.log(error);
    process.exit(1);
  }
};

export default connectToDatabase;