import { StatusCodes } from "http-status-codes";
import { db } from "../model/index.js";
import BadRequestError from "../errors/bad-request.js";
const { Client, User, Invoice } = db.models;

const createClient = async (req, res) => {
  const id = req.user.id;
  const { email } = req.body;
  if (await Client.findOne({ where: { email: email } })) {
    res.json({
      status: false,
      message: `Client with email: ${email} exists`,
    });
  }

  await Client.create({
    ...req.body,
    user_id: id,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ status: 201, message: "Client Created Successfully" });
};
const getAllClients = async (req, res) => {
  const id = req.user.id;
  const client = await Client.findAll({
    where: { user_id: id },
    include: [
      {
        model: Invoice,
      },
    ],
  });
  res.json({
    status: StatusCodes.OK,
    message: "Clients Fetched Successfully",
    data: client,
  });
};
const getClient = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const client = await findClient(id, userId);
  return res.json({
    status: true,
    message: "Client Fetched Successfully",
    data: client,
  });
};

const createInvoice = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const userId = req.user.id;
  await Invoice.create({
    ...req.body,
    user_id: userId,
    client_id: id,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ status: 201, message: "Invoice Created Successfully" });
};

const getAllInvoices = async (req, res) => {
  const { id } = req.params;
  const client = await Invoice.findAll({
    where: { client_id: id },
  });
  res.json({
    status: StatusCodes.OK,
    message: "Invoice Fetched Successfully",
    data: client,
  });
};

//helper to find client with id
async function findClient(id, userId) {
  const user = await Client.findOne({
    where: { user_id: userId, id: id },
    include: [
      {
        model: Invoice,
      },
    ],
  });
  if (!user) throw new BadRequestError(`Client with  not exist`);
  return user;
}

async function findInvoice(id, userId) {
  const user = await Invoice.findOne({
    where: { user_id: userId, id: id },
  });
  if (!user) throw new BadRequestError(`Invice with  not exist`);
  return user;
}

export {
  createClient,
  getClient,
  getAllClients,
  createInvoice,
  getAllInvoices,
};
