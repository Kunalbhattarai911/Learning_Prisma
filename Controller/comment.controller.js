import prisma from "../DB/db.config.js";

// create comment
export const createComment = async (req, res) => {
  try {
    const userId = req.params.id;
    const { post_id, comment } = req.body;

    await prisma.post.update({
      where: {
        id: Number(post_id),
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });

    const addComment = await prisma.comment.create({
      data: {
        user_id: Number(userId),
        post_id: Number(post_id),
        comment: comment,
      },
    });

    return res.status(201).json({
      message: "Comment Created Successful",
      success: true,
      addComment,
    });
  } catch (error) {
    console.log(error);
  }
};

//get all comment by
export const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        post: true,
        user: true,
      },
    });

    if (comments.length === 0) {
      return res.status(404).json({
        message: "No Comments found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comments Details",
      success: true,
      data: comments,
    });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Occured While Fetchich Comments",
      success: false,
      error: error.message,
    });
  }
};

//get comment by id
export const getCommentById = async (req, res) => {
  try {
    const commentId = req.params.id;

    const existingComment = await prisma.comment.findUnique({
      where: { id: String(commentId) },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment Not Found",
        success: false,
      });
    }

    const getComment = await prisma.comment.findFirst({
      where: {
        id: String(commentId),
      },
      include: {
        user: true,
        post: true,
      },
    });

    return res.status(200).json({
      message: "Comments Details",
      success: true,
      data: getComment,
    });
  } catch (error) {
    console.log("Error Details:", error);
    return res.status(500).json({
      message: "An Error Occured While Fetching Comments",
      success: false,
      error: error.message,
    });
  }
};

//update comment data
export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { comment } = req.body;

    const existingComment = await prisma.comment.findUnique({
      where: { id: String(commentId) },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment Not Found",
        success: false,
      });
    }

    const updateData = {};

    if (comment) {
      updateData.comment = comment;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No Data Provided To Update",
        success: false,
      });
    }

    const updateComments = await prisma.comment.update({
      where: {
        id: String(commentId),
      },
      data: updateData,
    });

    return res.status(201).json({
      message: "Comment Updated Successful",
      success: true,
      updateComments,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const existingComment = await prisma.comment.findUnique({
      where: { id: String(commentId) },
      include: {
        post: true,
      },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment Not Found",
        success: false,
      });
    }

    const postId = existingComment.post.id;

    await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        comment_count: {
          decrement: 1,
        },
      },
    });

    await prisma.comment.delete({
      where: {
        id: String(commentId),
      },
    });

    return res.status(200).json({
      message: "Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
