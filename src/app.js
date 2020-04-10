/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import {} from 'dotenv/config';
import _ from 'lodash';
import routes from './routes';
import { Response } from './helpers';
import { messages } from './locales';
const app = express();
app.use(cors());
app.use(express.static('public'));

app.use(helmet()); // lọc các HTTP header độc hại
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use('/*', (req, res, next) => {
  global.language = req.headers.language || 'vi';
  next();
});

app.get('/', (req, res) => res.send('Xin chào các bạn, mình là bà Sĩ mậpppppp!'));
routes(app); // init routes

app.use((err, req, res, next) => {
  console.error(err.stack);
  return Response(res, 500, false, messages.INTERNAL_SERVER_ERROR, { error: err.stack });
});

app.use((req, res, next) => {
  res.setTimeout(+process.env.TIME_OUT || 10000, () => {
    return Response(res, 408, false, messages.REQUEST_TIMEOUT, {});
  });
  next();
});

const port = process.env.APP_PORT;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
export default app;
