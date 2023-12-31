import db from "../model/index.js";
const { user: User, client: Client } = db;

const getUser = async (req, res) => {
  const id = req.user.id;
  const user = await findUser(id);
  res.json({ status: true, message: "User fetched", data: user });
};
//helper to find user with id
async function findUser(id) {
  const user = await User.findOne({ where: { id: id }, include: [Client] });
  if (!user) throw new BadRequestError(`User with does not exist`);
  return user;
}

export { getUser };
