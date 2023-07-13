const { Users, Comments } = require("../models");

class CommentsRepository {
  createComment = async ({ postId, comment, userId }) => {
    const { nickname } = await Users.findOne({ where: { userId } });
    const createComments = await Comments.create({
      UserId: userId,
      PostId: postId,
      Nickname: nickname,
      comment,
    });

    return { data: createComments };
  };

  getAllComments = async ({ postId }) => {
    const getAllComment = await Comments.findAll({
      where: { PostId: postId },
      attributes: { exclude: ["PostId"] },
      order: [["createdAt", "DESC"]],
    });
    return getAllComment;
  };

  updatedComment = async ({ commentId, comment, userId }) => {
    const updatedCommentOne = await Comments.update(
      {
        comment,
      },
      {
        where: {
          commentId,
          userId,
        },
      }
    );
    return updatedCommentOne;
  };

  deleteComment = async ({ commentId, userId }) => {
    const deleteCommentOne = await Comments.destroy({
      where: {
        commentId,
        userId,
      },
    });
    return deleteCommentOne;
  };
}

module.exports = CommentsRepository;
