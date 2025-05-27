const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://ergogo.pro'],
  credentials: true
}));

app.use('/auth', require('./routes/auth'));
app.use('/patients', require('./routes/patients'));
app.use('/notes', require('./routes/notes'));
app.use('/contacts', require('./routes/contacts'));
app.use('/health', require('./routes/healthData'));
app.use('/motifs', require('./routes/motifs'));
app.use('/objectives', require('./routes/objectives'));
app.use('/activities', require('./routes/activities'));
app.use('/goals', require('./routes/goals'));
app.use('/files', require('./routes/activityFiles'));
app.use('/reports', require('./routes/reports'));
app.use('/appointments', require('./routes/appointments'));
app.use('/materials', require('./routes/materialRoutes'));
app.use('/therapists', require('./routes/therapists'));

app.get('/', (req, res) => {
  res.send('Ergogo backend is up and running ✅');
});

module.exports = app;
