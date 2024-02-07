import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import {verifyJwt} from "../middlewares/Auth.js"

const router = express.Router();
router.route("/update/:id").post(verifyJwt,updateUser);
router.route("/delete/:id").delete(verifyJwt,deleteUser);

export default router;
