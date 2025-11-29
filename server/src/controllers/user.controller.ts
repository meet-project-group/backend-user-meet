import { Request, Response } from "express";
import { auth, db } from "../config/firebase";

const usersRef = db.collection("users");

/**
 * @description Register user using email and password.
 * @route POST /api/users/register
 */
/**
 * @description Register user using Firebase token + save to Firestore.
 * @route POST /api/users/register
 */
export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, age, email, firebaseToken } = req.body;

    if (!firstName || !lastName || !age || !email || !firebaseToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Verificar token de Firebase
    const decoded = await auth.verifyIdToken(firebaseToken);
    const uid = decoded.uid;

    // 2. Guardar datos en Firestore (NO volver a crear usuario)
    await usersRef.doc(uid).set({
      uid,
      firstName,
      lastName,
      age,
      email,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "User registered",
      uid,
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}




/**
 * @description Login using email and password.
 * @route POST /api/users/login
 */
export async function login(req: Request, res: Response) {
  return res.status(501).json({
    message:
      "Login should be handled from frontend using Firebase Web SDK. Backend only verifies tokens if needed.",
  });
}

/**
 * @description Login using Google/Facebook provider token.
 * @route POST /api/users/provider-login
 */

export const providerLogin = async (req, res) => {
  try {
    const { firebaseToken, email } = req.body;

    if (!firebaseToken)
      return res.status(400).json({ message: "Missing firebaseToken" });

    // 1. Verificar el token con auth
    const decoded = await auth.verifyIdToken(firebaseToken);
    const uid = decoded.uid;

    // 2. Buscar usuario en Firestore
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    // 3. Si NO existe → crear usuario vacío
    if (!doc.exists) {
      await userRef.set({
        uid,
        email,
        firstName: "",
        lastName: "",
        age: null,
        createdAt: new Date()
      });
    }

    // 4. Obtener usuario
    const user = (await userRef.get()).data();

    return res.json({
      token: firebaseToken,
      user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @description Send password recovery email.
 * @route POST /api/users/recover-password
 */
export async function recoverPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    await auth.generatePasswordResetLink(email);

    return res.json({ message: "Password reset email sent" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * @description Get user by UID.
 * @route GET /api/users/:uid
 */
export async function getUser(req: Request, res: Response) {
  try {
    const doc = await usersRef.doc(req.params.uid).get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });

    return res.json(doc.data());
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * @description Update user in Auth and Firestore.
 * @route PUT /api/users/:uid
 */
export async function updateUser(req: Request, res: Response) {
  try {
    const { firstName, lastName, age, email, password } = req.body;
    const uidParam = req.params.uid;

    // 1️⃣ Extraer token del header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Missing token" });

    // 2️⃣ Verificar token con Firebase
    const decoded = await auth.verifyIdToken(token);
    const authUid = decoded.uid;

    // 3️⃣ Validación correcta
    if (authUid !== uidParam)
      return res.status(403).json({ message: "You cannot edit another user" });

    // 4️⃣ Actualizar Firebase Auth
    const authUpdateData: any = {};

    if (email) authUpdateData.email = email;
    if (password) authUpdateData.password = password;
    if (firstName || lastName)
      authUpdateData.displayName = `${firstName ?? ""} ${lastName ?? ""}`;

    if (Object.keys(authUpdateData).length > 0) {
      await auth.updateUser(authUid, authUpdateData);
    }

    // 5️⃣ Actualizar Firestore
    await usersRef.doc(authUid).update({
      firstName,
      lastName,
      age,
      email,
      updatedAt: new Date(),
    });

    return res.json({ message: "User updated successfully" });

  } catch (error: any) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: error.message });
  }
}


/**
 * @description Delete user in Auth and Firestore.
 * @route DELETE /api/users/:uid
 */
export async function deleteUser(req: Request, res: Response) {
  try {
    const uid = req.params.uid;

    await auth.deleteUser(uid);
    await usersRef.doc(uid).delete();

    return res.json({ message: "User deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * @description List all users.
 * @route GET /api/users/
 */
export async function listUsers(req: Request, res: Response) {
  try {
    const snap = await usersRef.get();
    const users = snap.docs.map((d) => d.data());

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

