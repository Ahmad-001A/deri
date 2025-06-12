const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// В память для примера
const users = [];

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

// Принимаем данные
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Имя и пароль обязательны.');
  }

  // Сохраняем пользователя
  users.push({ username, password });

  // Отвечаем красивой страницей
  res.send(`
    <html>
      <head>
        <title>Пользователь зарегистрирован</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f0f4f8;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            color: #555;
            margin: 10px 0;
            word-wrap: break-word;
          }
          .label {
            font-weight: bold;
            color: #222;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Регистрация прошла успешно!</h1>
          <p><span class="label">Имя пользователя:</span> ${sanitize(username)}</p>
          <p><span class="label">Пароль:</span> ${sanitize(password)}</p>
        </div>
      </body>
    </html>
  `);
});

// Маршрут для просмотра всех пользователей
app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`Сервер готов принимать данные по POST /submit на порту ${port}`);
});
