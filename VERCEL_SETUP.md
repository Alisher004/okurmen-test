# Настройка Vercel

## Переменные окружения

Добавьте следующие переменные окружения в настройках проекта Vercel:

### 1. DATABASE_URL
```
postgresql://user:password@host:port/database?sslmode=require
```
Ваша строка подключения к PostgreSQL (Neon, Supabase, или другой провайдер)

### 2. AUTH_SECRET
```
your-secret-key-change-this-in-production
```
Секретный ключ для NextAuth (сгенерируйте случайную строку)

Для генерации секретного ключа выполните:
```bash
openssl rand -base64 32
```

### 3. NEXTAUTH_URL (опционально)
```
https://your-domain.vercel.app
```
URL вашего приложения (Vercel автоматически устанавливает это)

## Настройка базы данных

1. Убедитесь, что база данных доступна из интернета
2. Выполните миграции:
   ```bash
   npx prisma migrate deploy
   ```

## Создание админа

После деплоя выполните локально:
```bash
npm run tsx scripts/create-admin-direct.mjs
```

Или подключитесь к БД напрямую и выполните SQL:
```sql
INSERT INTO users (id, email, password, role, "fullName", phone, age, "createdAt", "updatedAt")
VALUES (
  'admin-id',
  'admin@okurmen.com',
  '$2a$10$хешированный_пароль',
  'ADMIN',
  'Администратор',
  '+996700000000',
  30,
  NOW(),
  NOW()
);
```

## Build Settings в Vercel

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Проверка

После деплоя проверьте:
1. Главная страница: `https://your-domain.vercel.app`
2. Админ логин: `https://your-domain.vercel.app/admin-login`
3. API health: `https://your-domain.vercel.app/api/auth/providers`
