import { Router } from "express";
import { verifyJwt } from "../middlewares/Auth.js";
import {
  createListing,
  getUserListings,
} from "../controllers/listing.controller.js";

const router = Router();
router.route("/create").post(verifyJwt, createListing);
router.route("/listing/:id").get(verifyJwt, getUserListings);

export default router;
