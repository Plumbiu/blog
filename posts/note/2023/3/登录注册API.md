---
title: 一个简单的注册登录API(prisma+express+ts)
date: 2023-03-31
---

# 初始化工作

我们直接使用 `prisma` 官方给出的 `typescript + express` 官方示例：[prisma_ts_express](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-express)

项目文件：[Plumbiu/login_signup](https://github.com/Plumbiu/login_signup)

完成以下操作，`yarn dev` 即可启动服务

## 调整表结构和 seed.ts

```typescript
// prisma/schema/prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 也可以换其他数据库
  url      = "file:./dev.db"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  username  String
  password String
  token String
}
```

```typescript
// prisma/schema/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

## 初始化依赖

**安装依赖：**

-   `jsonwebtoken`：用来前后端权限认证的依赖

-   `body-parser`：用来获取请求参数里的 `body` 数据
-   `concurrently`：用来执行多条命令行
-   `@types/jsonwebtoken`： 为 `jsonwebtoken` 依赖提供 `ts` 类型支持

```bash
yarn add jsonwebtoken body-parser
yarn add concurrently @types/jsonwebtoken  -D 
```

**调整 `package.json`**

```json
"scripts": {
      "dev": "concurrently \"npx prisma studio\" \"nodemon src/index.ts\""
}
```

>   如果没有安装 `nodemon`，请执行命令 `npm i -g nodemon`

## 创建 `.db` 文件

运行以下命令：

```bash
npx prisma migrate dev --name init
```

# 编写 API 接口

初始化 `src/index.ts` 文件，之后的文件不再 `import` 了：

```typescript
import { PrismaClient } from '@prisma/client'
import express from 'express'
import bodyParser from 'body-parser'
import crypto from 'crypto' // nodejs 内置的加密算法，不需要额外安装
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
```

## 加密算法

我们存储用户的 `password` 时，不能以明文存储，否则数据库数据一旦泄露，用户账户就会非常的危险。

这里使用的加密算法是 `aes-256-cbc`

>   注：`AES_SECRET_KEY` 和 `AES_SECRET_IV` 是有长度要求的，需要满足：`两者长度乘积 / 2 === 256`

```typescript
const AES_SECRET_KEY = '0123456789abcdefghijklmnopqrstuv'
const AES_SECRET_IV = '0123456789abcdef'
// 加密算法
function encrypt(password: string) {
  let decipher = crypto.createCipheriv('aes-256-cbc', AES_SECRET_KEY, AES_SECRET_IV)
  return decipher.update(password, 'binary', 'hex') + decipher.final('hex')
}
// 解密算法
function decrypt(crypted: string ) {
  crypted = Buffer.from(crypted, 'hex').toString('binary')
  let decipher = crypto.createDecipheriv('aes-256-cbc', AES_SECRET_KEY, AES_SECRET_IV)
  return decipher.update(crypted, 'binary', 'utf-8') + decipher.final('utf-8')
}
```

**举例使用：**

```typescript
let encryptedPassword = encrypt('hello') // 加密的字符串
let password = decrypt(encryptedPassword) // 'hello' => 解密的字符串
```

## signup 注册接口

注册接口的时候需要获取用户的 `email, username, password`，`token` 暂时为空字符串，同时对用户的密码进行加密

```typescript
const JWT_SECRET_KEY = 'plumbiu' // 准备 JWT 的密钥

app.post('/signup', async (req, res) => {
  /* 这里不对 usernmae, emial, password 是否为空做判断，是因为这是前端的工作 */
  const { username, email, password } = req.body
  // 1.加密密码
  const crypetedPassword = encrypt(password)
  // 2.存储用户信息
  try {
    await prisma.user.create({
      data: {
        username, email, token: '',
        password: crypetedPassword
      }
    })
    res.send({
      code: 2000,
      message: '注册成功'
    })
  } catch (err) {
    res.send({
      code: 2001,
      message: '注册失败'
    })
  }
})
```

## 登录接口

登录接口我们采用 `email + password` 实现，如果希望实现 `email/username + password`，可以对用户传过来的数据，判断是 `email` 还是 `username`(例如邮箱数据都含有 `‘@’` 字符)，同时生成 `token`

```typescript
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  // 1.获取用户信息
  try {
    let user = await prisma.user.findUnique({
      where: { email }
    })
    // 如果用户不存在或者密码错误，则抛出一个错误
    if (!user || decrypt(user.password) !== password) {
      throw new Error('邮箱不存在或者密码错误')
    }
    // 1.生成 token
    const token = jwt.sign({
      email,
      // username
    }, JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 30 // token 的有效期为 30 天
    })
    // 2.更新用户信息
    await prisma.user.update({
      where: { email },
      data: { token }
    })
    res.send({
      code: 2000,
      message: '登录成功',
      token
    })
  } catch (err: any) {
    res.send({
      code: 2002,
      message: err.message
    })
  }
})
```

>   注：如果在登录之后希望服务端返回 `username` 数据，最好把在 `jwt.sign()` 的第一个参数中加入 `username`

