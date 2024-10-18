import express from "express";

import { getAll, getUserById, updateUserById } from "../controllers/users.js";
import { authenticateUser, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", authenticateUser, authorizeAdmin, getAll);
router.get("/:userId",authenticateUser, authorizeAdmin, getUserById);
router.put("/:userId",authenticateUser, authorizeAdmin, updateUserById);

export default router;
