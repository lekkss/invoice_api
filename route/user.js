import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import { getUser } from "../controller/user.js";

router.route("/").get(auth, getUser);

export default router;
