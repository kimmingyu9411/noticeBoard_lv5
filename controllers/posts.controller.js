const PostsService = require("../services/posts.service");
class PostsController {
  postService = new PostsService();

  createPost = async (req, res) => {
    const { userId } = res.locals.user;
    const { category, title, content, url } = req.body;
    try {
      const createPostData = await this.postService.createPost({
        userId,
        category,
        title,
        content,
        url,
      });
      res.status(200).json({ data: createPostData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getPosts = async (req, res) => {
    try {
      const posts = await this.postService.findAllPost();
      res.status(200).json({ data: posts });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  getPostsDetail = async (req, res) => {
    const { postId } = req.params;
    try {
      const postDetail = await this.postService.findOnePost({ postId });

      res.status(200).json({ data: postDetail });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  updatedPost = async (req, res) => {
    const { postId } = req.params;
    const { title, content, url, category } = req.body;
    const { userId } = res.locals.user;
    try {
      await this.postService.updatedPost({
        postId,
        userId,
        title,
        content,
        url,
        category,
      });
      res.status(201).json({ message: "게시글이 수정되었습니다." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deletePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const deletePostOne = await this.postService.deletePost({ postId, userId });

    if (deletePostOne) {
      res.status(201).json({ message: "게시글이 삭제되었습니다." });
    } else {
      res.status(404).json({ message: "게시글이 존재하지않습니다." });
    }
  };

  likePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    try {
      const likePostOne = await this.postService.likePost({ postId, userId });
      res.status(200).json({ data: likePostOne });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getLikePosts = async (req, res) => {
    const { userId } = res.locals.user;
    try {
      const getLikePost = await this.postService.getLikePosts({ userId });
      res.status(200).json({ data: getLikePost });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
module.exports = PostsController;
