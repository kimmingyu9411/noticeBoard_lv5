const { Posts, Users, Likes } = require("../models");
const { Op } = require("sequelize");
class PostRepository {
  createPost = async ({ userId, category, title, content, url }) => {
    // ORM인 Sequelize에서 posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    const { nickname, description } = await Users.findOne({
      where: { userId },
    });
    const createPostData = await Posts.create({
      UserId: userId,
      Nickname: nickname,
      Description: description,
      category,
      title,
      content,
      url,
      likeCount: 0,
    });
    return createPostData;
  };

  findAllPost = async () => {
    // ORM인 Sequelize에서 posts 모델의 findAll 메소드를 사용해 데이터를 요청합니다.
    const postlist = await Posts.findAll({
      attributes: { exclude: ["content"] },
      order: [["createdAt", "DESC"]],
    });

    return postlist;
  };

  findOnePost = async ({ postId }) => {
    const postDetail = await Posts.findOne({ where: { postId } });

    return postDetail;
  };

  updatedPost = async ({ postId, userId, title, content, url, category }) => {
    console.log(title);
    const updatedPostData = await Posts.update(
      { title, content, url, category },
      { where: { postId, userId } }
    );
    return updatedPostData;
  };

  deletePost = async (postId, userId) => {
    const deletPostData = await Posts.destroy({
      where: {
        postId,
        userId,
      },
    });
    return deletPostData;
  };

  likePost = async (postId, userId) => {
    try {
      const updatedPost = await Posts.findOne({ where: { postId } });
      const updatedLike = await Likes.findOne({ where: { userId, postId } });
      if (!updatedPost) {
        throw new Error("게시글이 없습니다.");
      }
      if (!updatedLike) {
        await Likes.create({
          UserId: userId,
          PostId: postId,
        });
        const likeList = await Likes.findAndCountAll({
          where: { PostId: postId },
        });
        await Posts.update(
          { likeCount: likeList.count },
          {
            where: { postId },
          }
        );
        return { message: "좋아요" };
      } else {
        await Likes.destroy({
          where: {
            [Op.and]: [{ PostId: postId }, { UserId: userId }],
          },
        });
        const likeList = await Likes.findAndCountAll({
          where: { PostId: postId },
        });
        await Posts.update(
          { likeCount: likeList.count },
          {
            where: { postId },
          }
        );
        return { message: "좋아요취소" };
      }
    } catch (err) {
      throw new Error("좋아요에 실패했습니다.");
    }
  };

  getLikePosts = async ({ userId }) => {
    try {
      const likeUser = await Likes.findAll({
        where: { UserId: userId },
        attributes: ["PostId"],
      });
      const likeArr=await likeUser.map((a)=>{
        return a.PostId
      })
      const likeList= await Posts.findAll({
        where:{
          postId:likeArr
        },
        order:[['likeCount','DESC']]
      })
      return { likeList:likeList, message: "좋아요를 조회하였습니다." };
    } catch (err) {
      console.log(err);
      return { errorMessage: "좋아요 조회에 실패하였습니다." };
    }
  };
}
module.exports = PostRepository;
