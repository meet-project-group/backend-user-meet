// Import Request and Response types from Express for strong typing.
import { Request, Response } from "express";
// Import Firestore database instance.
import { db } from "../config/firebase";

// Reference to the "meetings" Firestore collection.
const meetingsRef = db.collection("meetings");


// ======================
// 📌 Create Meeting
// ======================
export async function createMeeting(req: Request, res: Response) {
  try {
    // Extract user ID and host name from the request body.
    const { uid, hostName } = req.body;

    // Validate required fields.
    if (!uid || !hostName)
      return res.status(400).json({ message: "uid & hostName required" });

    // Generate a random meeting ID using base36 string.
    const meetingId = Math.random().toString(36).substring(2, 10);

    // Structure of the meeting document to store in Firestore.
    const data = {
      id: meetingId,
      hostId: uid,
      hostName,
      createdAt: new Date(),
    };

    // Save the meeting document using the meeting ID as Firestore doc ID.
    await meetingsRef.doc(meetingId).set(data);

    // Respond with the created meeting data.
    return res.status(201).json(data);

  } catch (e: any) {
    // Server-side error handling.
    return res.status(500).json({ error: e.message });
  }
}


// ======================
// 📌 Get Meeting by ID
// ======================
export async function getMeeting(req: Request, res: Response) {
  try {
    // Extract meeting ID from route parameter.
    const id = req.params.id;

    // Fetch the meeting document from Firestore.
    const doc = await meetingsRef.doc(id).get();

    // If the meeting does not exist, return 404.
    if (!doc.exists) return res.status(404).json({ message: "Meeting not found" });

    // Respond with stored meeting data.
    return res.json(doc.data());

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}


// ===============================
// 📌 List Meetings for a User
// ===============================
export async function listMeetings(req: Request, res: Response) {
  try {
    // Extract UID from the query string.
    const { uid } = req.query;

    // Check if UID was provided.
    if (!uid) return res.status(400).json({ message: "uid is required" });

    // Query Firestore for all meetings where hostId equals the user ID.
    const meetings = await meetingsRef.where("hostId", "==", uid).get();

    // Convert Firestore documents into plain objects.
    const list = meetings.docs.map(m => m.data());

    // Send the meeting list as response.
    return res.json(list);

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}


// ======================
// 📌 Delete Meeting
// ======================
export async function deleteMeeting(req: Request, res: Response) {
  try {
    // Extract meeting ID from route params.
    const id = req.params.id;

    // Delete the Firestore document.
    await meetingsRef.doc(id).delete();

    // Respond confirming deletion.
    return res.json({ message: "Meeting deleted", id });

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

