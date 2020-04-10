/* eslint-disable no-undef */
import mongoose from 'mongoose';

const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
const DB_CONNECT = NODE_ENV === 'development' ? `${DB_USER}:${DB_PASS}@` : '';

mongoose.connect(`mongodb://${DB_CONNECT}${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => { console.log('Connected Mongo DB'); });

export default mongoose;
