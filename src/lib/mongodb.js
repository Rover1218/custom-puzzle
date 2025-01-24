import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};

export default connectDB;
