const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { google } = require('googleapis');
const sqlite3 = require('better-sqlite3');
const cors = require('cors');
const app = express();
app.use(cors());

// Conexión Turso (SQLite compatible)
const db = new sqlite3('./turso.db');

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS postulaciones (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    email TEXT,
    telefono TEXT,
    cargo TEXT,
    mensaje TEXT,
    archivo_url TEXT,
    fecha_envio TEXT
  )
`).run();

// Configuración de Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // generado en Google Cloud Console
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

app.post('/api/formulario', upload.single('archivo'), async (req, res) => {
  try {
    const { nombre, email, telefono, cargo, mensaje } = req.body;
    const file = req.file;

    // Subir a Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype
      },
      media: {
        mimeType: file.mimetype,
        body: Buffer.from(file.buffer)
      }
    });

    const fileId = response.data.id;

    // Hacer público el archivo
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

    // Guardar en Turso
    const stmt = db.prepare(`
      INSERT INTO postulaciones (nombre, email, telefono, cargo, mensaje, archivo_url, fecha_envio)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(nombre, email, telefono, cargo, mensaje, fileUrl);

    res.json({ success: true });
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));
