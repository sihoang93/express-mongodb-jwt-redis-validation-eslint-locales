import mongoose from '../config/database';
const ObjectId = mongoose.Schema.Types.ObjectId;
const AuthSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    default: null,
  },
  accessToken: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
});
const Auth = mongoose.model('tokens', AuthSchema);
export default Auth;
