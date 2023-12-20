import { CronJob } from "cron";
import { getInvoiceByDueDate } from "../controller/invoice.js";
import { sendEmail } from "../util/sendEmail.js";

export const job = new CronJob(
  "0 0 * * *", // cronTime
  async function () {
    const invoices = await getInvoiceByDueDate(3);
    for (const invoice of invoices) {
      const invoiceData = invoice.dataValues;
      try {
        const to = invoiceData.client.dataValues.email;
        const name = `${invoiceData.client.dataValues.first_name} ${invoiceData.client.dataValues.last_name}`;
        // console.log(to, name);
        const subject = `Invoice Payment Reminder`;
        // console.log(invoice);
        sendEmail(
          to,
          subject,
          name,
          invoiceData.payment_link,
          invoiceData.due_date,
          invoiceData.amount / 100,
          "invoice"
        );
      } catch (error) {
        console.log(error);
      }
    }

    // console.log("You will see this message every second");
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);
