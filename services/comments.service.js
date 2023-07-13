const CommentsRepository = require("../repositories/comments.repository");

class CommentsService {
  commentsRepository = new CommentsRepository();

  createComment = async ({ postId, comment, userId }) => {
    const createComments = await this.commentsRepository.createComment({
      postId,
      comment,
      userId,
    });

    return { data: createComments };
  };

  getAllComments = async ({ postId }) => {
    const getAllComment = await this.commentsRepository.getAllComments({
      postId,
    });

    return getAllComment;
  };

  updatedComment = async ({ commentId, comment, userId }) => {
    const updatedCommentOne = await this.commentsRepository.updatedComment({
      commentId,
      comment,
      userId,
    });

    return updatedCommentOne;
  };

  deleteComment = async ({ commentId, userId }) => {
    const deleteCommentOne = await this.commentsRepository.deleteComment({
      commentId,
      userId,
    });

    return deleteCommentOne;
  };
}

module.exports = CommentsService;
