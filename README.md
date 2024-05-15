# BUmPTy OJ

## 部署

### 安装 Node.js

本项目基于Node.js与Vue.js开发，因此在部署前需要安装Node.js作为后端的运行环境和前端的构建环境。

本项目在开发时使用的Node.js版本为20.13.1，建议安装相同版本的Node.js。

请参考[Node.js官方网站](https://nodejs.org/)来安装Node.js。

### 安装 MariaDB

本项目使用 MariaDB 作为数据库。

请参考[MariaDB官方网站](https://mariadb.org/)来安装 MariaDB。

### 构建前端

Node.js 安装完成后，您需要构建前端代码，使其能够在浏览器中运行。

1. 打开终端，进入项目的 `frontend` 目录。
2. 创建 `.env` 文件，添加以下内容：

```bash
VUE_APP_API_URL=http://localhost:3000 # 后端服务器的地址
```

3. 执行 `npm install` 安装项目的依赖。
4. 执行 `npm run build` 构建前端代码。

构建完成后，您可以在 frontend/dist 目录中找到构建好的前端代码。您可以使用 Nginx 或其他 Web 服务器来托管这些文件。请注意，由于使用了SPA（单页应用）的开发模式，您需要配置 Web 服务器以使得所有的请求默认指向 index.html 文件。

### 部署后端

1. 打开终端，进入项目的 `backend` 目录。
2. 在 `.env` 文件中添加以下内容：

```bash
DATABASE_URL="mysql://root:password@localhost:3306/bumptyoj" # 数据库的 URL
JWT_SECRET="your_secret" # 用于生成 JWT 的密钥，可以是任意字符串
```

3. 执行`npm install` 安装项目的依赖。
4. 执行 `npx prisma migrate deploy` 来创建数据库表。
5. 执行 `npx prisma generate` 来生成 Prisma Client。
6. 执行 `npm run build` 构建后端代码。
7. 执行 `npm run start` 启动后端服务器。

后端服务器默认监听在 8888 端口。您可以在 `.env` 文件中修改 `PORT` 变量来更改端口。

如果您不希望使用 Prisma 来管理数据库，您可以手动依次执行建库脚本 `backend/prisma/migrations/` 路径下的各个文件夹中的 `migration.sql` 文件来创建数据库表。

请注意，启动后端服务器后，终端关闭会导致服务器关闭。您可以使用 PM2 或其他进程管理工具来管理后端服务器。

您可能需要配置您的 Web 服务器，将`/api`路径的请求转发到后端服务器。以下是一个 Nginx 的配置示例：

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8888;
    }
}
```

## 开发

### 启动开发服务器

- 后端
    1. `cd ./backend && npm i`，随后在 `.env` 文件的变量 `DATABASE_URL` 中配置数据库的URL。
    2. 执行 `npx prisma migrate dev && npx prisma generate`
    3. 执行 `npm run dev` 以启动开发服务器。
- 前端
    1. `cd ./frontend && npm i`
    2. 执行 `npm run serve` 以启动开发服务器。
