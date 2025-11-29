import { Router } from "express";
import {
  register,
  login,
  providerLogin,
  recoverPassword,
  getUser,
  updateUser,
  deleteUser,
  listUsers,
} from "../controllers/user.controller";

import { requireAuth } from "../middlewares/auth.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/provider-login", providerLogin);
router.post("/recover-password", recoverPassword);

router.get("/", listUsers);
router.get("/:uid", getUser);
router.put("/:uid", requireAuth, updateUser);

router.delete("/:uid", deleteUser);

export default router;
