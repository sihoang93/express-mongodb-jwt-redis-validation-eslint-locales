import mongoose from '../config/database';
const ObjectId = mongoose.Schema.Types.ObjectId;
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    categories: {
      type: Array,
      default: [],
    },
    status: {
      type: Number,
      default: 1,
    },
    userId: {
      type: ObjectId,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);
const Post = mongoose.model('posts', PostSchema);
export default Post;
