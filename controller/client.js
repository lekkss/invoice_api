import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.js";
import { sendEmail } from "../util/sendEmail.js";
import { getAuthorizationUrl } from "../util/paystack.js";
import db from "../model/index.js";
const { client: Client, invoice: Invoice } = db;

const createClient = async (req, res) => {
  const id = req.user.id;
  const { email } = req.body;
  if (await Client.findOne({ where: { email: email } })) {
    throw new BadRequestError(`Client with email: ${email} exists`);
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
    include: [Invoice],
  });
  res.json({
    status: true,
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
  const { amount } = req.body;
  const clientId = req.user.id;
  const client = await findClientUUID(id, clientId);
  const { email, first_name, last_name, id: client_id } = client.dataValues;
  const to = email;
  const subject = `New invoice created for ${first_name}`;
  let url;
  try {
    await getAuthorizationUrl(email, amount)
      .then((authorizationUrl) => {
        url = authorizationUrl;
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
    const invoice = await Invoice.create({
      ...req.body,
      payment_link: url,
      user_id: clientId,
      client_id: client_id,
    });
    const { payment_link, due_date } = invoice.dataValues;
    const name = `${first_name} ${last_name}`;
    const date = due_date;
    const link = payment_link;
    const template = "invoice";
    // const amount = invoice.dataValues.amount / 100;

    sendEmail(
      to,
      subject,
      name,
      link,
      invoice.dataValues.amount / 100,
      date,
      template
    );
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: "Invoice Created Successfully" });
  } catch (error) {
    console.log("ERROR", error);
    res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ status: false, message: "Error" });
  }
};

const getAllInvoices = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const c = await findClientUUID(id, user_id);
  const { id: client_id } = c.dataValues;
  const client = await Invoice.findAll({
    where: { client_id: client_id },
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
  if (!user) throw new BadRequestError(`Invoce does not exist`);
  return user;
}

export {
  createClient,
  getClient,
  getAllClients,
  createInvoice,
  getAllInvoices,
};
