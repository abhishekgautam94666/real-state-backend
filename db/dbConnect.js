import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const ConectionDB = await mongoose.connect(
      `${process.env.MONGO_URL}/realState`
    );

    if (!ConectionDB) {
      console.log("Some Error connecting mongoDb");
    }
    console.log(`MngoDb connected !! DB Host:${ConectionDB.connection.host}`);
  } catch (error) {
    console.log("MongoDb Connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
