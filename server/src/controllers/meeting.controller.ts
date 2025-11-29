import { Request, Response } from "express";
import { db } from "../config/firebase";

const meetingsRef = db.collection("meetings");

// Crear reunión
export async function createMeeting(req: Request, res: Response) {
  try {
    const { uid, hostName } = req.body;

    if (!uid || !hostName)
      return res.status(400).json({ message: "uid & hostName required" });

    const meetingId = Math.random().toString(36).substring(2, 10);

    const data = {
      id: meetingId,
      hostId: uid,
      hostName,
      createdAt: new Date(),
    };

    await meetingsRef.doc(meetingId).set(data);

    return res.status(201).json(data);

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

// Obtener reunión por ID
export async function getMeeting(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const doc = await meetingsRef.doc(id).get();

    if (!doc.exists) return res.status(404).json({ message: "Meeting not found" });

    return res.json(doc.data());
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

// Listar reuniones por usuario
export async function listMeetings(req: Request, res: Response) {
  try {
    const { uid } = req.query;

    if (!uid) return res.status(400).json({ message: "uid is required" });

    const meetings = await meetingsRef.where("hostId", "==", uid).get();
    const list = meetings.docs.map(m => m.data());

    return res.json(list);

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

// Eliminar reunión
export async function deleteMeeting(req: Request, res: Response) {
  try {
    const id = req.params.id;

    await meetingsRef.doc(id).delete();

    return res.json({ message: "Meeting deleted", id });

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
