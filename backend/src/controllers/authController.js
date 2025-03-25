const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const therapist = await prisma.therapist.findUnique({ where: { email } })
    if (!therapist) {
      return res.status(401).json({ message: 'Email incorrect' })
    }

    const valid = await bcrypt.compare(password, therapist.passwordHash)
    if (!valid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' })
    }

    const token = jwt.sign({ id: therapist.id, email: therapist.email, name: therapist.name }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // passe à true en prod avec HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ message: 'Connexion réussie ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// backend/src/controllers/authController.js

const me = (req, res) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: 'Non authentifié' })
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      res.json({ id: decoded.id, email: decoded.email, name: decoded.name })
    } catch (err) {
      res.status(401).json({ message: 'Token invalide' })
    }
  }

const logout = (req, res) => {
    res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false // true en prod avec HTTPS
    })
    res.json({ message: 'Déconnecté' })
}
  

module.exports = { login, me, logout }

