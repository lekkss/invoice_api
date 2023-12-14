import Jwt from "jsonwebtoken";

const generateToken = (id, username) => {
  return Jwt.sign({ id: id, username: username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
export { generateToken };
