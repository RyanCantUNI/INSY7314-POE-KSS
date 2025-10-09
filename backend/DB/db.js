//plugins
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGODB_uri

//connection string
export const client = new MongoClient(connectionString);

//connect to database
export async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}