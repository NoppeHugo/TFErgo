
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()


const app = express()

console.log('PORT:', process.env.PORT)

// Middlewares globaux
app.use(express.json())
app.use(cookieParser())

// CORS 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/patients', require('./routes/patients'))

// Serveur 
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))

