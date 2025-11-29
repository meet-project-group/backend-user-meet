import { Router } from "express";
import { createMeeting, getMeeting, listMeetings, deleteMeeting } from "../controllers/meeting.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createMeeting);
router.get("/", requireAuth, listMeetings);
router.get("/:id", requireAuth, getMeeting);
router.delete("/:id", requireAuth, deleteMeeting);

export default router;
