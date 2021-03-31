import express, { NextFunction, Request, Response } from 'express';
import user from './router/user';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './db';
import chalk from 'chalk';
import { HttpError } from './models/Errors/httpError';
import admin from 'firebase-admin'
import * as serviceAccount from './horsefarmbelzycefirebaseadminsdk.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://horse-farm-belzyce.firebaseio.com"
})


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
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST, PUT,PATCH, OPTIONS, DELETE'
  );
  next();
});

app.use('/api/user', user);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const ipReqest = req.connection.remoteAddress;
  console.error(
    chalk.red(`[Node ---> Error] from ip :  ${ipReqest}`),
    'Code:',
    err.errorCodeBackEnd,
    err.errorMessageBackEndLog,
    err.errorMessageFrontEnd
  );
  console.dir(err.errorInputForm);
  res
    .status(err.errorCodeFrontEnd)
    .json({ message: err.errorMessageFrontEnd, error: err.errorInputForm });
});
console.log(chalk.yellowBright('[Server] run on port: ', PORT));
app.listen(PORT);
