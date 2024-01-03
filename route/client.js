import express from "express";
const router = express.Router();
import {
  createClient,
  createInvoice,
  getAllClients,
  getAllInvoices,
  getClient,
} from "../controller/client.js";
import validateRequest from "../middleware/validate.js";
import { createInvoiceSchema } from "../validations/invoiceValidation.js";
import { createClientSchema } from "../validations/clientValidation.js";

router
  .route("/")
  .get(getAllClients)
  .post(validateRequest(createClientSchema), createClient);
router.get("/:id", getClient);
router
  .route("/:id/invoices")
  .get(getAllInvoices)
  .post(validateRequest(createInvoiceSchema), createInvoice);

export default router;
