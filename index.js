require('dotenv').config();

const express = require('express');
const router = require('./app/router');
const jwt = require('jsonwebtoken');


// JWT
const app = express();

const port = process.env.PORT || 3000;

//JWT
process.env.TOKEN_SECRET;


app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, _ => {
    console.log(`http://localhost:${port}`);
});

// JWT
app.post('/api/createNewUser', (req, res) => {
    // ...
  
    const token = generateAccessToken({ username: req.body.username });
    res.json(token);
  
    // ...
  });