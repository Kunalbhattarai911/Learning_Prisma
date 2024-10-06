import prisma from "../DB/db.config.js";

export const addPost = async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, description } = req.body;

    // Find the user first if it exists
    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    // If user is not found
    if (!findUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    const createPost = await prisma.post.create({
      data: {
        title,
        description,
        user: {
          connect: { id: Number(userId) },
        },
      },
    });

    // Return a success response
    return res.status(201).json({
      message: "Post Created Successfully",
      success: true,
      createPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while creating the post",
      success: false,
      error: error.message,
    });
  }
};

// Get All Posts
export const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0 || limit > 100) {
      limit = 10;
    }

    const skip = (page - 1) * limit;
    // const query = req.query.q
    // Fetch all posts from the database
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      where: {
        //  AND : [
        //   {
        //     title : {
        //       startsWith : "Saturday",
        //       // endsWith : "day",
        //       // equals : "Dell"
        //     }
        //   },
        //   {
        //     title : {
        //       endsWith : "y"
        //     }
        //   }
        //  ]
        // description : {
        //   search : query
        // },
        // title:{
        //   search : query
        // },
      },
    });

    //to get the total post count
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts/limit)

    // Return the posts in the response
    return res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      posts,
      meta : {
        totalPages,
        currentPage : page,
        limit : limit
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while fetching posts",
      success: false,
      error: error.message,
    });
  }
};

//get post by id
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const findPost = await prisma.post.findFirst({
      where: {
        id: Number(postId),
      },
      include: {
        user: true,
        comment: true,
      },
    });

    if (!findPost) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Details",
      success: true,
      findPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while fetching posts",
      success: false,
      error: error.message,
    });
  }
};

// Get all posts by a specific user
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the posts for a specific user
    const userPosts = await prisma.post.findMany({
      where: {
        user_id: Number(userId),
      },
    });

    // If no posts are found for the user
    if (userPosts.length === 0) {
      return res.status(404).json({
        message: "No posts found for this user",
        success: false,
      });
    }

    return res.status(200).json({
      message: `User with name ${userPosts.name} posts fetched successfully`,
      success: true,
      userPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while fetching user posts",
      success: false,
      error: error.message,
    });
  }
};

//update post
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description } = req.body;

    const updateData = {};

    if (title) {
      updateData.title = title;
    }

    if (description) {
      updateData.description = description;
    }

    // If no fields are provided to update, return a 400 error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided to update",
        success: false,
      });
    }

    const findPost = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: updateData,
    });

    return res.status(201).json({
      message: "Post Update Successful",
      success: true,
      findPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while updating posts",
      success: false,
      error: error.message,
    });
  }
};

//delete post
export const deletePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const deletePost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    if (!deletePost) {
      return res.status(404).json({
        message: "Post Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Deleted success",
      success: true,
      deletePost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while deleting posts",
      success: false,
      error: error.message,
    });
  }
};
