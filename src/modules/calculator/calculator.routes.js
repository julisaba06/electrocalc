import { Router } from "express";
import {
  ohmController,
  powerController,
  conversionController
} from "./calc.controller.js";

const router = Router();

router.post("/ohm", ohmController);
router.post("/power", powerController);
router.post("/conversion", conversionController);

export default router;