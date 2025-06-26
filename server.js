require('dotenv').config();
// Este código es un ejemplo de cómo crear un servidor Express que maneje un formulario
// de postulaciones, suba un archivo a Google Drive y almacene la información en Turso.
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');
const { createClient } = require('@libsql/client'); // Turso
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

// 👉 Reemplaza estos datos con los tuyos de Turso
const turso = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

// Crear tabla si no existe
(async () => {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS postulaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT,
      telefono TEXT,
      cargo TEXT,
      mensaje TEXT,
      archivo_url TEXT,
      fecha_envio TEXT
    )
  `);
})();

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // ⚠️ Esto convierte los \n en saltos reales
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

// Configurar multer (subida a memoria)
const upload = multer({ storage: multer.memoryStorage() });

// ID de la carpeta de destino en Drive
const FOLDER_ID = process.env.GOOGLE_FOLDER_ID; // 👈 reemplaza con tu ID real

app.post('/api/formulario', upload.single('archivo'), async (req, res) => {
  try {
    const { nombre, email, telefono, cargo, mensaje } = req.body;
    const archivo = req.file;
    if (!archivo) return res.status(400).send('Archivo requerido.');

    const { Readable } = require('stream');

    // Subir a Google Drive dentro de la carpeta especificada
    const fileMetadata = {
      name: archivo.originalname,
      parents: [FOLDER_ID],
    };
    const media = {
      mimeType: archivo.mimetype,
      body: Readable.from(archivo.buffer),
    };

    const result = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    const fileId = result.data.id;

    // Hacer el archivo público
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const fecha = new Date().toISOString();

    // Guardar en Turso
    await turso.execute({
      sql: `
        INSERT INTO postulaciones (nombre, email, telefono, cargo, mensaje, archivo_url, fecha_envio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [nombre, email, telefono, cargo, mensaje, fileUrl, fecha],
    });

    res.status(200).send('Formulario enviado con éxito.');
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).send('Error al procesar el formulario.');
  }
});

app.listen(3000, () => console.log('✅ Servidor escuchando en http://localhost:3000'));
// Para probar la API, puedes usar Postman o cualquier cliente HTTP.
// Asegúrate de tener el archivo credentials.json en la raíz del proyecto.
// Puedes usar el siguiente comando para iniciar el servidor:
// node server.js
// Asegúrate de tener las dependencias instaladas:
// npm install express multer googleapis cors @libsql/client
// Recuerda reemplazar 'TU_ID_DE_CARPETA' con el ID real de tu carpeta en Google Drive. 