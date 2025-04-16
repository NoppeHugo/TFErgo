// backend/app.js ou backend/server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Debug port
console.log('PORT:', process.env.PORT);

// 🔐 Middlewares globaux
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// 🌐 CORS (frontend en localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 📦 Routes existantes
app.use('/auth', require('./routes/auth'));
app.use('/patients', require('./routes/patients'));
app.use('/notes', require('./routes/notes'));
app.use('/contacts', require('./routes/contacts'));
app.use('/health', require('./routes/healthData'));
app.use('/motifs', require('./routes/motifs'));
app.use('/objectives', require('./routes/objectives')); // Objectifs thérapeutiques des patients

// 🆕 Routes Activités thérapeutiques
app.use('/activities', require('./routes/activities'));     // GET, POST, PATCH, DELETE, /search
app.use('/goals', require('./routes/goals'));               // Objectifs liés aux activités
app.use('/files', require('./routes/activityFiles'));       // Upload/suppression de fichiers lié

app.use('/reports', require('./routes/reports'));
app.use("/appointments", require('./routes/appointments'));  // RDV thérapeutiques


// ✅ Middleware pour test de disponibilité
app.get('/', (req, res) => {
  res.send('Ergogo backend is up and running ✅');
});

// 🚀 Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
