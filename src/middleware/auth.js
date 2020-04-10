/* eslint-disable no-undef */
import { decodeToken } from '../helpers/auth';
import Auth from '../models/Auth';
import { Failure } from '../helpers/index';
import { messages } from '../locales';

const { ACCESS_TOKEN_SECRET } = process.env;

export const isAuth = async (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const accessToken = req.headers['accesstoken'];
  if (!accessToken) return Failure(res, messages.ACCESS_TOKEN_IS_REQUIRED, 403);
  if (!userAgent) return Failure(res, messages.USER_AGENT_IS_REQUIRED, 403);
  try {
    // check định dạng token, hết hạn
    const decoded = await decodeToken(accessToken, ACCESS_TOKEN_SECRET);
    // check xem access token có tồn tại trong DB hay ko (nếu muốn ép logout chỉ cần xóa access token trong DB)
    // Có thể đổi qua lưu token ở Redis nếu muốn
    const existAuth = await Auth.findOne({ userId: decoded.user.userId, accessToken, userAgent });
    if (!existAuth) return Failure(res, messages.UNAUTHORIZED, 401);
    req.authorization = decoded.user;
    next();
  } catch (err) {
    return Failure(res, messages.UNAUTHORIZED, 401);
  }
};
