import mongoose from 'mongoose';

const connectDB = async() => {
    try{
        mongoose.connection.on('error', (err) => console.log('Database Connection Error:', err));
        mongoose.connection.on('disconnected', () => console.log('Database Disconnected'));
        
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        })
        console.log('MongoDB connected successfully');
    } catch(error) {
        console.log('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

export default connectDB;