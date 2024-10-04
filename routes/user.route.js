import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../Controller/user.controller.js";
import {
  userRegisterValidation,
  userUpdateValidation,
} from "../middleware/validation/user.validation.js";

const router = express.Router();

router.post("/register", userRegisterValidation, createUser);
router.put("/update/:id", userUpdateValidation, updateUser);
router.get("/:id", getUser);
router.get("/", getUsers);
router.delete("/delete/:id", deleteUser)

export default router;
