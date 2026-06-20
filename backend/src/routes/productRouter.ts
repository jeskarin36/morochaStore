import { Router } from "express";
import { getCategories, getProductBySlug, listProducts } from "../controllers/productController.js";


const router = Router();

router.get("/",listProducts);
router.get("/",getCategories);
router.get("/",getProductBySlug);

export default router;