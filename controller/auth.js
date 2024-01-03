import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken } from "../util/index.js";
import { BadRequestError } from "../errors/index.js";
import db from "../model/index.js";
const { user: User } = db;

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide username and password");
  } else if (await User.findOne({ where: { email: email } })) {
    res.json({
      status: false,
      message: `user with email: ${email} exists`,
    });
  } else {
    let hashedPassword = await bcrypt.hash(password, 8);
    await User.create({ ...req.body, password: hashedPassword });
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: "User Created Successfully" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  if (!(await User.findOne({ where: { email: email } }))) {
    res.json({
      status: false,
      message: `email does not exist`,
    });
  } else {
    const user = await User.scope("withPassword").findOne({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestError("Invalid login Details");
    }
    const token = generateToken(user.id, user.email);
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Login successful",
      data: { user: { ...omitPassword(user.get()) }, token: token },
    });
  }
};

function omitPassword(user) {
  const { password, ...userWithoutHash } = user;
  return userWithoutHash;
}

export { register, login };
