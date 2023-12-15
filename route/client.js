import express from "express";
const router = express.Router();
import {
  createClient,
  createInvoice,
  getAllClients,
  getAllInvoices,
  getClient,
} from "../controller/client.js";

router.route("/").get(getAllClients).post(createClient);
router.get("/:id", getClient);
router.route("/:id/invoices").get(getAllInvoices).post(createInvoice);

export default router;
