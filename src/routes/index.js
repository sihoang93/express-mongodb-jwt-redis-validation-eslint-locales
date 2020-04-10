import auth from './api/auth';
import users from './api/users';
import posts from './api/posts';

export default app => {
  auth(app);
  users(app);
  posts(app);
};
