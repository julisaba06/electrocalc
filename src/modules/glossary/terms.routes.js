import { Router } from "express";
import {
  createTermController,
  deleteTermController,
  getTermController,
  getTermsController,
  updateTermController
} from "./glossary.controller.js";

const router = Router();

router.get("/", getTermsController);
router.get("/:id", getTermController);
router.post("/", createTermController);
router.put("/:id", updateTermController);
router.delete("/:id", deleteTermController);

export default router;