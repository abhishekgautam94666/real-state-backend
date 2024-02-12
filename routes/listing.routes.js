import { Router } from "express";
import { verifyJwt } from "../middlewares/Auth.js";
import {
  createListing,
  deleteListing,
  getListing,
  getUserListings,
  updateListing,
} from "../controllers/listing.controller.js";

const router = Router();
router.route("/create").post(verifyJwt, createListing);
router.route("/listing/:id").get(verifyJwt, getUserListings);
router.route("/delete/:id").delete(verifyJwt, deleteListing);
router.route("/update/:id").put(verifyJwt, updateListing);
router.route("/get/:id").get(getListing);
export default router;
