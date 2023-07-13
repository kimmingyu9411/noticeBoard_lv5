const PostsRepository = require("../repositories/posts.repository");
class PostsService {
  postRepository = new PostsRepository();

  createPost = async (userId, category, title, content, url) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createPostData = await this.postRepository.createPost(
      userId,
      category,
      title,
      content,
      url
    );
    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: createPostData.null,
      userId: createPostData.userId,
      title: createPostData.title,
      url: createPostData.url,
      content: createPostData.content,
      createdAt: createPostData.createdAt,
      updatedAt: createPostData.updatedAt,
    };
  };

  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();
    return allPost;
  };

  findOnePost = async (postId) => {
    const postDetail = await this.postRepository.findOnePost(postId);

    if (!postDetail) {
      throw new Error("해당 게시글이 존재하지 않습니다.");
    }
    return postDetail;
  };

  updatedPost = async (postId, userId, title, content, url, category) => {
    const updatedPostData = await this.postRepository.updatedPost(
      postId,
      userId,
      title,
      content,
      url,
      category
    );
    return updatedPostData;
  };

  deletePost = async ({ postId, userId }) => {
    return await this.postRepository.deletePost(postId, userId);
  };

  likePost = async ({ postId, userId }) => {
    return await this.postRepository.likePost(postId, userId);
  };

  getLikePosts = async ({ userId }) => {
    return await this.postRepository.getLikePosts({ userId });
  };
}
module.exports = PostsService;
