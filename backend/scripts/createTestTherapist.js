// scripts/createTestTherapist.js
const dotenv = require('dotenv')
dotenv.config()

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const password = 'test1234'
  const hash = await bcrypt.hash(password, 10)

  const therapist = await prisma.therapist.create({
    data: {
      name: 'Thera Test',
      email: 'theraa@example.com',
      passwordHash: hash
    }
  })

  console.log('✅ Thérapeute créé :', therapist)
}

main()
  .catch(e => {
    console.error('Erreur :', e)
  })
  .finally(() => prisma.$disconnect())
