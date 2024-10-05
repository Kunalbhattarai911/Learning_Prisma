import express from 'express'
import { createComment, deleteComment, getCommentById, getComments, updateComment } from '../Controller/comment.controller.js';

const router = express.Router()

router.post("/create/:id", createComment)
router.get("/get", getComments)
router.get("/get/:id", getCommentById)
router.put("/update/:id", updateComment)
router.delete("/delete/:id", deleteComment)

export default router;