import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import meetingRoutes from "./routes/meeting.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

export default app;
