const jwt = require('jsonwebtoken')

function authenticateJWT(req, res, next) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'Token manquant' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' })
  }
}

module.exports = { authenticateJWT }
