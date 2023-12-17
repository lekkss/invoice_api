import { Sequelize } from "sequelize";
import db from "../model/index.js";
const { client: Client, invoice: Invoice } = db;
const getInvoiceByDueDate = async (days) => {
  const currentDate = new Date();
  const dueDateThreshold = new Date(currentDate);
  dueDateThreshold.setDate(currentDate.getDate() + days);
  try {
    const invoices = await Invoice.findAll({
      where: {
        due_date: {
          [Sequelize.Op.lt]: dueDateThreshold,
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });

    return invoices;
  } catch (error) {
    throw error;
  }
};

const getClient = () => {};

export { getInvoiceByDueDate };
