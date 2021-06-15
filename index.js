require('dotenv').config();

const bodyParser = require('body-parser');


const cors = require('cors');

const express = require('express');
const router = require('./app/router');

const app = express();

app.use(cors('*'));

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);

app.listen(port, _ => {
    console.log(`http://localhost:${port}`);
});