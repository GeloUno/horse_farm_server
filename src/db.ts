import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const URL_DB = `mongodb+srv://${process.env.USER_NAME_DB}:${process.env.PASSWORD}@cluster0.lyc0d.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(URL_DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(chalk.greenBright('[MongoDB] connected ...'));
  } catch (error) {
    console.log(
      chalk.bgRedBright(' [MongoDB] ---> [ERROR]: Connected to mongoDB FAILED ')
    );
    throw new Error('No connect to mongoDB ');
  }
};

export default connectDB;
