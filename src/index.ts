import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

dotenv.config();

import app from './app'

//Connects to the Database -> then starts the express
createConnection()
  .then(async (connection) => {
      app.listen(process.env.PORT || 3000, () => {
          console.log('Server started on port 3000!');
      });
  })
  .catch((error) => {
    console.log(error);
    console.log(process.env.TYPEORM_DATABASE);
  });
