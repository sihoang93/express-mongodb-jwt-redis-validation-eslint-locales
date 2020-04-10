/* eslint-disable no-sparse-arrays */
import { body, param } from 'express-validator';
import { register, verify, login, passwordReset } from '../../controllers/auth';
import { Validate } from '../../helpers';
import { messages } from '../../locales';

export default (app) => {
  app.post(
    '/register',
    [
      body('username').trim().not().isEmpty().withMessage(messages.ACCOUNT_IS_REQUIRED),
      body('email').trim().not().isEmpty().withMessage(messages.EMAIL_IS_REQUIRED).isEmail().withMessage(messages.EMAIL_IS_INVALID),
      body('password').trim().not().isEmpty().withMessage(messages.PASSWORD_IS_REQUIRED),
    ],
    Validate,
    register
  );

  app.get(
    '/verify/:username/:key',
    [
      param('username').trim().not().isEmpty().withMessage(messages.ACCOUNT_IS_REQUIRED),
      param('key').trim().not().isEmpty().withMessage(messages.KEY_IS_REQUIRED),
    ],
    Validate,
    verify
  );

  app.post(
    '/login',
    [
      body('account').trim().not().isEmpty().withMessage(messages.ACCOUNT_IS_REQUIRED),
      body('password').trim().not().isEmpty().withMessage(messages.PASSWORD_IS_REQUIRED),
    ],
    Validate,
    login
  );

  app.post(
    '/password-reset',
    [body('email').trim().not().isEmpty().withMessage(messages.EMAIL_IS_REQUIRED).isEmail().withMessage(messages.EMAIL_IS_INVALID)],
    Validate,
    passwordReset
  );

  app.get(
    '/password-reset/:username/:key',
    [
      param('username').trim().not().isEmpty().withMessage(messages.ACCOUNT_IS_REQUIRED),
      param('key').trim().not().isEmpty().withMessage(messages.KEY_IS_REQUIRED),
    ],
    Validate,
    passwordReset
  );

  app.put(
    '/password-reset',
    [
      body('username').trim().not().isEmpty().withMessage(messages.ACCOUNT_IS_REQUIRED),
      body('key').trim().not().isEmpty().withMessage(messages.KEY_IS_REQUIRED),
      body('password').trim().not().isEmpty().withMessage(messages.PASSWORD_IS_REQUIRED),
    ],
    Validate,
    passwordReset
  );
};
