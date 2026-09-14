import mongoose from "mongoose";
import dotenv from "./dotenv";
import logger from "./logger";
dotenv.config();

const {
  DB_URL: ENV_DB_URL,
  DB_HOST = "127.0.0.1",
  DB_PORT = "27017",
  DB_USER = "",
  DB_PWD = "",
  DB_NAME,
  // DB_REPLICA_SET,
} = process.env;

const DB_URL = ENV_DB_URL || (
  DB_USER && DB_PWD
    ? `mongodb+srv://${DB_USER}:${DB_PWD}@cluster0.chd2oc3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    : `mongodb://${DB_HOST}:${DB_PORT}`
);
console.log("DB_URL", DB_URL);

const connectDatabase = (callback?: () => void) => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      dbName: DB_NAME,
      // auth: {
      //   user: DB_USER,
      //   password: DB_PWD,
      // },
      // authSource: DB_NAME,
    })
    .then(() => {
      logger.info("MongoDB connected:", {
        url: DB_URL,
        dbName: DB_NAME,
      });
      if (callback) callback();
    })
    .catch((err) => logger.error("MongoDB initial connection error: ", err));
  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB error: ", err);
  });
};

export default connectDatabase;
