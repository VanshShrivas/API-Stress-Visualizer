import mongoose from 'mongoose';

export default async function connectDB() {
    const uri = process.env.MONGODB_URI;

    try {
        await mongoose.connect(uri);
        console.log(`[DB] Connected to MongoDB at ${uri}`);
    } catch (err) {
        console.error('[DB] MongoDB connection failed:', err.message);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        console.error('[DB] MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('[DB] MongoDB disconnected.');
    });
}
