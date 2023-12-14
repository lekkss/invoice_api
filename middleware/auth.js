// const User = require("../model/User");
import Jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeaders.split(" ")[1];

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    // const user = User.findById(decoded.id).select("-password");
    // req.user = user;
    const { id, email } = decoded;
    req.user = { id, email };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export default auth;
