import { Router } from "express";
import { verifyJwt } from "../middlewares/Auth.js";
import { createListing } from "../controllers/listing.controller.js";

const router = Router();
router.route('/create').post(verifyJwt,createListing)

export default router;
