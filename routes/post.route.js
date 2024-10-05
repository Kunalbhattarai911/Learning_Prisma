import express from "express";
import { addPost, getPostById, getPosts, getUserPosts, updatePost, deletePost } from "../Controller/post.controller.js";

const router = express.Router();

router.post("/add/:id", addPost)
router.get("/", getPosts)
router.get("/:id", getPostById)
router.get("/user/:id/post", getUserPosts)
router.put("/update/:id" , updatePost)
router.delete("/delete/:id", deletePost)

export default router;
