
# 🚀 **Полная инструкция по запуску твоего todo‑monorepo**

## 1) Клонируем репозиторий

```bash
git clone https://github.com/AndreiZaretski/todo-monorepo.git
cd todo-monorepo
```

---

## 2) Устанавливаем зависимости (для всех workspace‑ов)

```bash
yarn install
```

Yarn сам установит зависимости для:

- `apps/api`
- `apps/web`
- `packages/db`

---

## 3) Создаём `.env` в корне монорепы данные берем из  env.example

---

## 4) Генерируем Prisma Client

```bash
yarn prisma:generate
```

Это выполнит:

```
yarn workspace db prisma generate
```

и создаст:

```
packages/db/generated/prisma/
```

---

## 5) Применяем миграции (создаём dev.db)

```bash
yarn prisma:migrate
```

Это выполнит:

```
yarn workspace db prisma migrate dev
```

После этого появится файл:

```
packages/db/prisma/dev.db
```

---

## 6) Запускаем API (NestJS)

```bash
yarn dev:api
```

Это выполнит:

```
yarn workspace api start:dev
```

API поднимется на:

```
http://localhost:4000
```

---

## 7) Запускаем фронтенд (Next.js)

В отдельном терминале:

```bash
yarn dev:web
```

Это выполнит:

```
yarn workspace web dev
```

Фронт поднимется на:

```
http://localhost:3000
```

---

## 8) Запуск всего проекта одной командой

Если хочешь поднять **и API, и WEB** одновременно:

```bash
yarn dev
```

Это запускает:

```
concurrently "yarn dev:api" "yarn dev:web"
```

---

# 🎉 Готово

После этих шагов:

- Prisma работает  
- Nest API работает  
- tRPC работает  
- Next.js работает  
- dev.db создан  
- монорепа полностью функционирует  

---