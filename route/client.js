import express from "express";
const router = express.Router();
import { createClient, getClient } from "../controller/client.js";

router.route("/").get(getClient).post(createClient);

export default router;
