"use strict";

const express = require("express");
const { Op } = require("sequelize");
const { Posts, Users, Likes } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { category, title, content, url } = req.body;

  try {
    if (!req.body) {
      return res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!category) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 카테고리의 형식이 일치하지 않습니다." });
    }
    if (!title) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (!content) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    if (!url) {
      return res
        .status(412)
        .json({ errorMessage: "Url의 형식이 일치하지 않습니다." });
    }
    const { nickname, description } = await Users.findOne({
      where: { userId },
    });
    const createdPost = await Posts.create({
      UserId: userId,
      Nickname: nickname,
      Description: description,
      category,
      title,
      content,
      url,
      likeCount: 0,
    });
    res
      .status(201)
      .json({ post: createdPost, message: "게시글 작성에 성공하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 작성에 실패하였습니다." });
  }
});

// 게시글 전체 조회 API
router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: { exclude: ["content"] },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ posts: posts });
  } catch (err) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 상세 조회 API
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res
        .status(400)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    return res.json({ post: post });
  } catch (err) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 조회에 실패하였습니다." });
  }
});

//게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { category, title, content, url } = req.body;

  try {
    const updatedPost = await Posts.findOne({ where: { postId } });
    if (!updatedPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    if (!req.body) {
      return res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!category) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 카테고리의 형식이 일치하지 않습니다." });
    }
    if (!title) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (!content) {
      return res
        .status(412)
        .json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    if (!url) {
      return res
        .status(412)
        .json({ errorMessage: "Url의 형식이 일치하지 않습니다." });
    }
    if (userId !== updatedPost.UserId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글 수정의 권한이 존재하지 않습니다." });
    }

    await Posts.update(
      { category, title, content, url },
      {
        where: {
          [Op.and]: [{ postId }, { UserId: userId }],
        },
      }
    );
    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 수정에 실패하였습니다." });
  }
});

//게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  try {
    const deletedPost = await Posts.findOne({ where: { postId } });
    if (!deletedPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    if (userId !== deletedPost.UserId) {
      return res
        .status(403)
        .json({ errorMessage: "게시글의 삭제 권한이 존재하지 않습니다." });
    }

    await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      },
    });

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 삭제에 실패하였습니다." });
  }
});

//좋아요 PUT
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  try {
    const updatedPost = await Posts.findOne({ where: { postId } });
    const updatedLike = await Likes.findOne({
      where: { userId, postId },
    });
    if (!updatedPost) {
      return res
        .status(404)
        .json({ errorMessage: "게시글이 존재하지 않습니다." });
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

      res
        .status(201)
        .json({ likes: likeList.count, message: "좋아요를 성공하였습니다." });
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
      res
        .status(201)
        .json({ likes: likeList.count, message: "좋아요를 취소하였습니다." });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ errorMessage: "좋아요에 실패했습니다." });
  }
});

//좋아요 GET
router.get("/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
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
    return res.status(200).json({ likeList:likeList, message: "좋아요를 조회하였습니다." });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ errorMessage: "좋아요 조회에 실패하였습니다." });
  }
});

module.exports = router;
