import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

dotenv.config();

import app from './app'

createConnection({
  type: 'mongodb',
  useNewUrlParser: true,
  entities: [ 'src/entity/**/*.ts' ],
  url: process.env.TYPEORM_URL,
  database: process.env.TYPEORM_DATABASE
})
  .then(async (connection) => {
    const port = process.env.PORT || 3000;
      app.listen(process.env.PORT || port, () => {
          console.log(`Server started on port ${port}!`);
      });
  })
  .catch((error) => {
    console.error(error)
  });
