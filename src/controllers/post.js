import Post from '../models/Post';
import { Success, Failure } from '../helpers';
import { messages } from '../locales';
import * as asyncRedis from 'async-redis';
const client = asyncRedis.createClient();

export const createPost = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.authorization.userId,
    };
    const post = await new Post(data).save();
    return Success(res, { post });
  } catch (err) {
    return next(err);
  }
};

export const updatePostByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    let data = {
      ...req.body,
      userId: req.authorization.userId,
    };
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $set: data },
      {
        runValidators: true,
        new: true,
        select: 'title content thumbnail userId status createdAt updatedAt',
      }
    );
    if (!post) return Failure(res, messages.POST_NOT_FOUND, 404);
    return Success(res, { post });
  } catch (err) {
    return next(err);
  }
};

export const deletePostByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId }, 'userId');
    if (!post) return Failure(res, messages.POST_NOT_FOUND, 404);
    if (req.authorization.userId !== post.userId.toString()) return Failure(res, messages.DO_NOT_HAVE_PERMISSION, 403); // Check role

    const result = await Post.findOneAndDelete({ _id: postId });
    if (result) return Success(res, {}, messages.POST_ALREADY_DELETED);
  } catch (err) {
    return next(err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    // Nhớ cài redis không nó lỗi á: brew install redis && redis-server
    // 1.6 Đầu tiên, thử truy xuất đến bộ nhớ Redis Cache trước
    const postsCache = await client.get(`cache:posts`);
    if (postsCache) return Success(res, { posts: JSON.parse(postsCache) });

    console.log('Không dùng cache');
    const posts = await Post.find({}, 'title content thumbnail status createdAt');
    await client.set(`cache:posts`, JSON.stringify(posts));
    return Success(res, { posts });
  } catch (err) {
    return next(err);
  }
};

export const getPostByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId }, 'title content thumbnail status createdAt');
    if (!post) return Failure(res, messages.POST_NOT_FOUND, 404);
    return Success(res, { post });
  } catch (err) {
    return next(err);
  }
};
