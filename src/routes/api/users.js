/* eslint-disable no-undef */
import { body } from 'express-validator';
import { getUsers, getUserByUserId, updateUserByUserId, deleteUserByUserId } from '../../controllers/user';
import { isAuth } from '../../middleware/auth';
import { Validate } from '../../helpers';
import { messages } from '../../locales';

export default (app) => {
  app.use(isAuth); // Route nào cần xác thực thì để bên dưới dòng này
  app.get('/users', getUsers);
  app.get('/users/:userId', getUserByUserId);
  app.put(
    '/users/:userId',
    [
      body('username').not().exists().withMessage(messages.CANNOT_UPDATE_ACCOUNT),
      body('email').optional().isEmail().withMessage(messages.EMAIL_IS_INVALID),
      body('gender').optional().isInt().withMessage(messages.GENDER_IS_INVALID),
      body('role').optional().isInt().withMessage(messages.ROLE_IS_INVALID),
    ],
    Validate,
    updateUserByUserId
  );
  app.delete('/users/:userId', deleteUserByUserId);
};
