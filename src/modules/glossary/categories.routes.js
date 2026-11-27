import { Router } from "express";
import { getCategoriesController } from "./glossary.controller.js";

const router = Router();

router.get("/", getCategoriesController);

export default router;