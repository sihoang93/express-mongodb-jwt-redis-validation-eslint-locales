import mongoose from '../config/database';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    fullName: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    birthDay: {
      type: String,
      default: null,
    },
    gender: {
      type: Number,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      default: 1,
    },
    key: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);
const User = mongoose.model('users', UserSchema);
export default User;
