import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import { db } from "../model/index.js";
import BadRequestError from "../errors/bad-request.js";
import { sendEmail } from "../util/sendEmail.js";
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
    .json({ status: true, message: "Client Created Successfully" });
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
  const { id } = req.params;
  const userId = req.user.id;
  const user = await findClientUUID(id, userId);
  const { email, first_name, last_name } = user.dataValues;
  const to = email;
  const subject = `New infoive created for ${first_name}`;

  try {
    const invoice = await Invoice.create({
      ...req.body,
      user_id: userId,
      client_id: id,
    });
    const { payment_link, due_date } = invoice.dataValues;
    const html = `
    <b>Hello ${first_name} ${last_name},</b>
    <p>Find your invoice attached. Please make the payment by ${due_date} using the following link:</p>
    <a href="https://www.google.com">${payment_link}</a>
  `;
    sendEmail(to, subject, html);
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: "Invoice Created Successfully" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ status: false, message: "Error" });
  }
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
  if (!user) throw new BadRequestError(`Client does not exist`);
  return user;
}
async function findClientUUID(uuid, userId) {
  const user = await Client.findOne({
    where: { uuid: uuid, user_id: userId },
  });
  if (!user) throw new BadRequestError(`Client does not exist`);
  return user;
}

async function findInvoice(id, userId) {
  const user = await Invoice.findOne({
    where: { user_id: userId, id: id },
  });
  if (!user) throw new BadRequestError(`Invice does not exist`);
  return user;
}

export {
  createClient,
  getClient,
  getAllClients,
  createInvoice,
  getAllInvoices,
};
