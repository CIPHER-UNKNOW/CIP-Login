const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');  // Adicione o body-parser para capturar dados do formulário
const bcrypt = require('bcrypt');  // Para criptografar senhas
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: '*****',
    password: '******',
    database: 'querys_db'
});

// Conexão com o banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, '../../')));
app.use(bodyParser.urlencoded({ extended: true }));  // Para capturar os dados do formulário
app.use(bodyParser.json());

// Endpoint para consulta de dados
app.get('/consulta', (req, res) => {
    const { search } = req.query;
    let query = 'SELECT * FROM people';

    if (search) {
        query += ` WHERE nome LIKE '%${search}%' OR email LIKE '%${search}%'`;
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao realizar a consulta:', err);
            res.status(500).send('Erro ao realizar a consulta.');
        } else {
            res.json(results);
        }
    });
});

// Rota para autenticação de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Erro ao realizar a consulta:', err);
            res.status(500).send('Erro ao realizar a consulta.');
        } else {
            if (results.length > 0) {
                const user = results[0];
                // Comparar senha usando bcrypt
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        res.redirect('/painel.html'); // Redireciona para o painel
                    } else {
                        res.send('Username ou senha incorretos!');
                    }
                });
            } else {
                res.send('Username não encontrado!');
            }
        }
    });
});

// Rota para registrar um novo usuário
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Criptografar a senha
  bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(query, [username, hash], (err, result) => {
          if (err) {
              console.error('Erro ao registrar usuário:', err);
              res.status(500).send('Erro ao registrar usuário.');
          } else {
              res.send('Usuário registrado com sucesso!');
          }
      });
  });
});

// Rota para logout

app.get("/logout", (freq, res) => {
  res.redirect('/login.html') // redireciona para formulario de login
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
