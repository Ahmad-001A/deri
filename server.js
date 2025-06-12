const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS (если отправка с другого сайта)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Главная страница (GET /)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Сервер работает</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f0f4f8;
            margin: 0;
          }
          h1 {
            color: #2c3e50;
          }
        </style>
      </head>
      <body>
        <h1>Сервер готов принимать данные по POST /submit</h1>
      </body>
    </html>
  `);
});

// Обработка POST-запроса
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Имя и пароль обязательны!');
  }

  res.send(`
    <html>
      <head>
        <title>Полученные данные</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #74ebd5, #9face6);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            max-width: 400px;
            text-align: center;
          }
          h2 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            color: #555;
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #000;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Получены данные</h2>
          <p><span class="label">Имя пользователя:</span> ${sanitize(username)}</p>
          <p><span class="label">Пароль:</span> ${sanitize(password)}</p>
        </div>
      </body>
    </html>
  `);
});

// Защита от XSS
function sanitize(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
