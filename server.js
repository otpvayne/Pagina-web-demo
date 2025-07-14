require('dotenv').config();
// Este código es un ejemplo de cómo crear un servidor Express que maneje un formulario
// de postulaciones, suba un archivo a Google Drive y almacene la información en Turso.
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');
const { createClient } = require('@libsql/client'); // Turso
const path = require('path');
const nodemailer = require('nodemailer');
// Asegúrate de tener las variables de entorno configuradas en un archivo .env
// TURSO_URL, TURSO_TOKEN, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_FOLDER_ID

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
    // 👉 Mover el archivo a la carpeta deseada
await drive.files.update({
  fileId,
  addParents: FOLDER_ID,
});


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
    // Crear transporte con nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

// Contenido del correo
const mailOptions = {
  from: `"La Casa del Kumis" <${process.env.EMAIL_FROM}>`,
  to: process.env.EMAIL_TO,
  subject: `📩 Nueva postulación - ${nombre}`,
  html: `
    <h2>📋 Nueva postulación recibida</h2>
    <ul>
      <li><strong>Nombre:</strong> ${nombre}</li>
      <li><strong>Correo:</strong> ${email}</li>
      <li><strong>Teléfono:</strong> ${telefono}</li>
      <li><strong>Cargo:</strong> ${cargo}</li>
      <li><strong>Mensaje:</strong> ${mensaje || '(Sin mensaje)'}</li>
      <li><strong>Archivo:</strong> <a href="${fileUrl}" target="_blank">Ver archivo</a></li>
      <li><strong>Fecha:</strong> ${new Date(fecha).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</li>
    </ul>
  `,
};

await transporter.sendMail(mailOptions);
console.log('✅ Correo enviado al cliente');

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

const { Parser } = require('json2csv');

app.get('/api/descargar-postulaciones', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM postulaciones ORDER BY fecha_envio DESC');
    const registros = result.rows;

    if (!registros.length) {
      return res.status(404).send('No hay postulaciones registradas.');
    }

    const dataLimpia = registros.map(r => ({
      Nombre: r.nombre,
      Correo: r.email,
      Teléfono: r.telefono,
      Cargo: r.cargo,
      Mensaje: r.mensaje,
      'Archivo (Google Drive)': r.archivo_url,
      'Fecha de Envío': new Date(r.fecha_envio).toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        hour12: true
      }),
    }));

    const parser = new Parser({
      fields: Object.keys(dataLimpia[0]),
      delimiter: ';' // <- Forzar punto y coma para Excel en español
    });

    const csv = parser.parse(dataLimpia);
    const bom = '\uFEFF'; // <- Byte Order Mark UTF-8

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('postulaciones.csv');
    res.send(bom + csv);
  } catch (error) {
    console.error('❌ Error generando CSV:', error);
    res.status(500).send('Error al generar el archivo.');
  }
});
