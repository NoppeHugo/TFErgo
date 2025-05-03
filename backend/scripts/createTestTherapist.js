// scripts/createTestTherapist.js
const dotenv = require('dotenv')
dotenv.config()

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const password = 'Ergogo0211.'
  const hash = await bcrypt.hash(password, 10)

  const therapist = await prisma.therapist.create({
    data: {
      name: 'Carla Serrig',
      email: 'serrigcarla@gmail.com',
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
