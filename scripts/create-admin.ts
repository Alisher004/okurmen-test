import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  adapter: undefined as any
})

async function main() {
  const email = 'admin@test.com'
  const password = 'admin123'
  
  // Проверяем, существует ли уже админ
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('❌ Админ с таким email уже существует')
    return
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10)

  // Создаем админа
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      fullName: 'Администратор',
      phone: '+7 000 000 00 00',
      age: 30
    }
  })

  console.log('✅ Админ успешно создан!')
  console.log('📧 Email:', email)
  console.log('🔑 Пароль:', password)
  console.log('👤 ID:', admin.id)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
