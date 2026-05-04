import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database connected successfully");
        });

        const mongodbURI = process.env.MONGODB_URI;
        const projectName = "resume-builder";

        await mongoose.connect(`${mongodbURI}/${projectName}`);

    } catch (error) {
        console.error("❌ DB Error:", error.message);
    }
};

export default connectDB;