import { createPost, getPosts, getPostByPostId, updatePostByPostId, deletePostByPostId } from '../../controllers/post';
import { isAuth } from '../../middleware/auth';

export default (app) => {
  app.use(isAuth); // Route nào cần xác thực thì để bên dưới dòng này
  app.post('/posts', createPost);
  app.get('/posts', getPosts);
  app.get('/posts/:postId', getPostByPostId);
  app.put('/posts/:postId', updatePostByPostId);
  app.delete('/posts/:postId', deletePostByPostId);
};
