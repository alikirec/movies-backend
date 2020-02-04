
// Create a new express application instance
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import routes from './routes';

const app = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//Set all routes from routes folder
app.use('/', routes);

export default app;
