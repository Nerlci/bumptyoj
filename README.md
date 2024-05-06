# BUmPTy OJ

## Run dev server

- backend
    1. `cd ./backend && npm i`, then config your database in file `.env`, with variable `DATABASE_URL`.
    2. Run `npx prisma migrate dev && npx prisma generate`
    3. Run `npm run dev` to start dev server.
