const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { google } = require('googleapis');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
app.use(cors());

// ✅ Conexión remota a Turso
const db = createClient({
  url: 'libsql://casa-del-kumis-otpvayne.aws-us-east-1.turso.io',  // <-- REEMPLAZA AQUÍ
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3Nzc5ODgzNjUsImlhdCI6MTc0NjQ1MjM2NSwiaWQiOiJlNmM1ZDg5NC03Y2I4LTRlZTMtOWNjNS1lMDg5MzY0ZGJiYzciLCJyaWQiOiIzMzNkMzJiNS05ODZmLTQwODAtYmI1NS05ODM2YmMyNDUwMDIifQ.EpajlPkAVEQJWPkXJ1LwWQXr_xaxu7durjrpzjYbS8wpDE5w8GTJ_UW3Ov0PqfcjxFpzNFJNqQj9cCCq4qLSDg',   // <-- REEMPLAZA AQUÍ si es requerido
});

// ✅ Configuración de Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // archivo de cuenta de servicio descargado de Google Cloud
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

app.post('/api/trabaja', upload.single('archivo'), async (req, res) => {
  try {
    const { nombre, correo, telefono, cargo, mensaje } = req.body;
    const file = req.file;

    let fileUrl = '';

    if (file) {
      // 📁 Subir archivo a Google Drive
      const uploadRes = await drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: Buffer.from(file.buffer),
        },
      });

      const fileId = uploadRes.data.id;

      // 🌐 Hacer archivo público
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
    }

    // 💾 Guardar en base de datos Turso
    await db.execute({
      sql: `
        INSERT INTO postulaciones 
        (nombre, email, telefono, cargo, mensaje, archivo_url, fecha_envio)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      args: [nombre, correo, telefono, cargo, mensaje, fileUrl],
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al procesar el formulario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
