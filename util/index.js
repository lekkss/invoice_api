import Jwt from "jsonwebtoken";

const generateToken = (id, email) => {
  return Jwt.sign({ id: id, email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
export { generateToken };
