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
    user: 'CIPHER',
    password: 'D1598753m@',
    database: 'querys_db'
});

// Conexão com o banco de dados
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
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
            console.error('Error performing query:', err);
            res.status(500).send('Error performing query.');
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
            console.error('Error performing query:', err);
            res.status(500).send('Error performing query.');
        } else {
            if (results.length > 0) {
                const user = results[0];
                // Comparar senha usando bcrypt
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        res.redirect('/painel.html'); // Redireciona para o painel
                    } else {
                        res.send('Incorrect username or password!');
                    }
                });
            } else {
                res.send('Username not found!');
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
              console.error('Error registering user:', err);
              res.status(500).send('Error registering user.');
          } else {
              res.send('User registered successfully!');
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
    console.log(`Server running on http://localhost:${PORT}`);
});
