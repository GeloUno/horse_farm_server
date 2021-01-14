import express, { NextFunction, Request, Response } from 'express';
import user from './router/user';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './db';
import chalk from 'chalk';
import { HttpError } from './models/Errors/httpError';

dotenv.config();
const app = express();
app.use(json());
connectDB();

const PORT = process.env.NODE_PORT || 3001;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, X-Requested-With, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  next();
});
app.use('/api/user', user);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const ipReqest = req.connection.remoteAddress;
  console.error(
    chalk.red(
      `[Node ---> Error] from ip :  ${ipReqest}`,
      err.errorCode,
      err.errorMessageServerLog,
      err.errorMessage
    )
  );
  console.dir(err.errorInputForm);
  res
    .status(err.errorCode)
    .json({ message: err.errorMessage, error: err.errorInputForm });
});
console.log(chalk.yellowBright('[Server] run on port: ', PORT));
app.listen(PORT);
