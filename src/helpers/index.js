import { validationResult } from 'express-validator';
import { messages } from '../locales';

export const Success = async (res, data) => {
  return res.send({
    status: 200,
    success: true,
    message: messages.SUCCESS,
    data: data || {},
  });
};

export const Failure = async (res, message, status, data) => {
  return res.send({
    status: status || 500,
    success: false,
    message: message || messages.SOMETHING_WENT_WRONG,
    data: data || {},
  });
};

export const Response = async (res, status, success, message, data) => {
  return res.send({
    status: status || 200,
    success: success,
    message: message || messages.SUCCESS,
    data: data || {},
  });
};

export const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Response(res, 422, false, errors.array()[0].msg, { errors: errors.array() });
  }
  return next();
};
