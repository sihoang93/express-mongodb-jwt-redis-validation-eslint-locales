/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { handleToken } from '../helpers/auth';
import { Success, Failure } from '../helpers';
import User from '../models/User';
import { messages } from '../locales';
import { sendMail } from '../services/email';
import mail from '../mail';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ $or: [{ username }, { email }] }, 'email');
    if (user) return email === user.email ? Failure(res, messages.EMAIL_EXISTED, 401) : Failure(res, messages.ACCOUNT_EXISTED, 401);

    const hashPassword = await bcrypt.hash(password, 10);
    const key = uuidV4();
    user = await new User({ username, email, password: hashPassword, key }).save();
    sendMail({
      to: email,
      from: {
        email: process.env.APP_EMAIL,
        name: process.env.APP_NAME,
      },
      subject: `${process.env.APP_NAME} ${messages.PLEASE_VERIFY_EMAIL}`,
      html: mail.register({ urlVerify: `${process.env.FRONTEND_URL}/verify/${username}/${key}` }),
    });
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      thumbnail: user.thumbnail,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };

    return Success(res, { user });
  } catch (err) {
    return next(err);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { username, key } = req.params;

    let user = await User.findOne({ username }, 'key status');
    if (!user) return Failure(res, messages.USER_NOT_FOUND, 404);
    if (user.status === 1) return Failure(res, messages.ACCOUNT_IS_ACTIVATED, 404);
    if (user.key !== key) return Failure(res, messages.KEY_NOT_FOUND, 404);

    user = await User.findOneAndUpdate(
      { username, key },
      { $set: { status: 1, key: null } },
      {
        runValidators: true,
        new: true,
        select: 'username email status',
      }
    );
    return Success(res, { user });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const userAgent = req.headers['user-agent'];

    let user = await User.findOne(
      { $or: [{ username: account }, { email: account }] },
      'username email password fullName thumbnail role status createdAt'
    ).lean(); // dùng lean để trả về 1 kết quả JSON, nhẹ hơn

    if (!user) return Failure(res, messages.ACCOUNT_NOT_FOUND, 404);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return Failure(res, messages.PASSWORD_DOES_NOT_MATCH, 401);
    if (user.status === 0) return Failure(res, messages.PLEASE_ACTIVE_ACCOUNT, 401, { isActivated: false });

    delete user.password;
    const accessToken = await handleToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      userAgent,
    });
    return Success(res, { accessToken, user });
  } catch (err) {
    return next(err);
  }
};

export const passwordReset = async (req, res, next) => {
  try {
    if (req.method === 'POST') {
      const { email } = req.body;
      let user = await User.findOne({ email }, 'username email status');
      const username = user.username;
      if (!user) return Failure(res, messages.EMAIL_NOT_FOUND, 404);
      if (user.status === 0) return Failure(res, messages.PLEASE_ACTIVE_ACCOUNT_FIRST, 401);

      const key = uuidV4();
      user = await User.findOneAndUpdate(
        { email },
        { $set: { key } },
        {
          runValidators: true,
          new: true,
          select: 'username key',
        }
      );

      sendMail({
        to: email,
        from: {
          email: process.env.APP_EMAIL,
          name: process.env.APP_NAME,
        },
        subject: `${process.env.APP_NAME} ${messages.LINK_TO_RESET_PASSWORD}`,
        html: mail.passwordReset({
          urlReset: `${process.env.FRONTEND_URL}/password-reset/${username}/${key}`,
        }),
      });
      return Success(res, {});
    }

    if (req.method === 'GET') {
      const { username, key } = req.params;
      let user = await User.findOne({ username }, 'username key status').lean();
      if (!user) return Failure(res, messages.USERNAME_NOT_FOUND, 404);
      if (user.status === 0) return Failure(res, messages.PLEASE_ACTIVE_ACCOUNT_FIRST, 401);
      if (user.key !== key) return Failure(res, messages.KEY_NOT_FOUND, 404);
      delete user.status;
      return Success(res, { user });
    }

    if (req.method === 'PUT') {
      const { username, key, password } = req.body;
      let user = await User.findOne({ username }, 'username key status');
      if (!user) return Failure(res, messages.USERNAME_NOT_FOUND, 404);
      if (user.status === 0) return Failure(res, messages.PLEASE_ACTIVE_ACCOUNT_FIRST, 401);
      if (user.key !== key) return Failure(res, messages.KEY_NOT_FOUND, 404);

      const hashPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { username, key },
        { $set: { password: hashPassword, key: null } },
        {
          runValidators: true,
          new: true,
          select: 'username',
        }
      );
      return Success(res, {});
    }
  } catch (err) {
    return next(err);
  }
};
