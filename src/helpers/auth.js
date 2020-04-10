import { sign, verify } from 'jsonwebtoken';
import Auth from '../models/Auth';
// eslint-disable-next-line no-undef
const { ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET } = process.env;

export const generateToken = (user, secretSignature, tokenExpire) => {
  try {
    const accessToken = sign({ user }, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenExpire,
    });
    return accessToken;
  } catch (err) {
    return err;
  }
};

export const decodeToken = (accessToken, secretKey) => {
  try {
    const decoded = verify(accessToken, secretKey);
    return decoded;
  } catch (err) {
    return err;
  }
};

export const handleToken = async (user) => {
  const accessToken = await generateToken(user, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE || '30d');
  // Trường hợp chỉ cho đăng nhập 1 nơi thì xóa hết token cũ, tạo token mới
  // Trường hợp đăng nhập nhiều nơi, check có tồn tại hay ko? có thì trả về token cũ
  await Auth.deleteMany({
    userId: user.userId,
  }); // remove old token
  await new Auth({ userId: user.userId, accessToken, userAgent: user.userAgent }).save(); // save token to db
  return accessToken;
};
