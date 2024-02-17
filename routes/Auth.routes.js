import { Router } from "express";
import {
  SignUp,
  google,
  signIn,
  signOut,
  checkCookie,
  root,
} from "../controllers/Auth.controller.js";
//import { verifyJwt } from "../middlewares/Auth.js";

const router = Router();
router.route("/test").get(root);
router.route("/signUp").post(SignUp);
router.route("/signIn").post(signIn);
router.route("/signOut").get(signOut);
router.route("/google").post(google);
router.route("/checkCookie").get(checkCookie);

export default router;
