import express from "express";
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";
import commentRoute from "./comment.route.js";

const router = express.Router();

//for user Routes
router.use("/api/user", userRoute);

//for Post Routes
router.use("/api/post", postRoute);

//For Comment Routes
router.use("/api/comment", commentRoute);

export default router;
