import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import routes from './routes';

const app = express();
app.use(cookieParser());

// Call midlewares
app.use(cors({ origin: true, credentials: true, }));
app.use(helmet());
app.use(bodyParser.json());

//Set all routes from routes folder
app.use('/', routes);

export default app;
