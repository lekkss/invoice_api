import { CronJob } from "cron";
import { getInvoiceByDueDate } from "../controller/invoice.js";
import { sendEmail } from "../util/sendEmail.js";

export const job = new CronJob(
  "0 0 * * *", // cronTime
  async function () {
    const invoices = await getInvoiceByDueDate(3);
    for (const invoice of invoices) {
      try {
        const to = invoice.dataValues.client.dataValues.email;
        const name = `${invoice.dataValues.client.dataValues.first_name} ${invoice.dataValues.client.dataValues.last_name}`;
        // console.log(to, name);
        const subject = `Invoice Payment Reminder`;
        // console.log(invoice);
        sendEmail(
          to,
          subject,
          name,
          invoice.dataValues.payment_link,
          invoice.dataValues.due_date,
          invoice.dataValues.amount / 100,
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
