import prisma from "../DB/db.config.js";

// Register User
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return res.status(400).json({
        message: "This Email is already registered.",
        success: false,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    return res.status(201).json({
      message: "Registration Scuuessful",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

//Get users data
export const getUsers = async (req, res) => {
  try {
    const findUser = await prisma.user.findMany({
     select : {
      id: true, 
      name : true,
      email : true,
      post : {
        select : {
          id : true,
          title : true,
          description : true,
          comment_count : true
        }
      },
      comment : true,
      _count : {
        select : {
          post : true,
          comment : true
        }
      }
     },
     orderBy : {
      id : "asc"
     },
    });

    if (!findUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Details",
      success: true,
      data: findUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

//Get User Data By ID
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const findUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include : {
        post : true,
      }
    });

    if (!findUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Details",
      success: true,
      findUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

//update user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    //empty object to store fields to be updated
    const updateData = {};

    // If a new email is provided, check if it already exists
    if (email) {
      const findEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (findEmail && findEmail.id !== Number(userId)) {
        return res.status(400).json({
          message: "This email is already registered",
          success: false,
        });
      }

      // Add email to the update data if it's valid
      updateData.email = email;
    }

    // Add name and password to the updateData if they are provided
    if (name) {
      updateData.name = name;
    }

    if (password) {
      updateData.password = password;
    }

    // If no fields are provided to update, return a 400 error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided to update",
        success: false,
      });
    }

    // Update the user data
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    return res.status(200).json({
      message: "User Data updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

//Delete User By ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const findUser = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    if(!findUser) {
      return res.status(404).json({
        message : "User Not Found",
        success : false
      })
    }

    return res.status(200).json({
      message : "User Deleted Successfull",
      success : true,
    })
  }catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};
