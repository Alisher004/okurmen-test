import pg from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { randomBytes } from 'crypto'

dotenv.config()

const { Client } = pg

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✓ Подключено к базе данных')

    const email = 'admin@test.com'
    const password = 'admin123'

    // Проверяем, существует ли уже админ
    const checkResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (checkResult.rows.length > 0) {
      console.log('❌ Админ с таким email уже существует')
      return
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Генерируем ID
    const id = 'c' + randomBytes(12).toString('base64url')

    // Создаем админа
    const result = await client.query(
      `INSERT INTO users (id, email, password, role, "fullName", phone, age, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [id, email, hashedPassword, 'ADMIN', 'Администратор', '+7 000 000 00 00', 30]
    )

    console.log('✅ Админ успешно создан!')
    console.log('📧 Email:', email)
    console.log('🔑 Пароль:', password)
    console.log('👤 ID:', result.rows[0].id)
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
