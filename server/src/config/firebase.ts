import admin from "firebase-admin";
import path from "path";
import fs from "fs";

// Ruta absoluta correcta al archivo de credenciales
const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");

// Validación: verificar que el archivo exista
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `❌ No se encontró serviceAccountKey.json en: ${serviceAccountPath}\n` +
      `➡ Debes poner tu archivo serviceAccountKey.json dentro de /server`
  );
}

// Cargar JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();
