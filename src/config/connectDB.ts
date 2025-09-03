import mongoose from "mongoose";

export const connectDb = async () => {
    const URI = process.env.MONGO_DB_URI as string;

    try {
        await mongoose.connect(URI);
        console.log(`Database Connected`);
    } catch (err) {
        console.log(err);
    }
}