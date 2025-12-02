// src/app.ts

import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import meetingRoutes from "./routes/meeting.routes";

/**
 * Creates and configures the Express application.
 * This file sets up the main middleware and route handlers
 * used throughout the backend server.
 */
const app = express();

// Enable Cross-Origin Resource Sharing to allow requests
// from different domains or frontend applications.
app.use(cors());

// Enable parsing of incoming JSON request bodies.
app.use(express.json());

// Register user-related API routes under the /api/users endpoint.
app.use("/api/users", userRoutes);

// Register meeting-related API routes under the /api/meetings endpoint.
app.use("/api/meetings", meetingRoutes);

// Export the configured Express application for server initialization.
export default app;
