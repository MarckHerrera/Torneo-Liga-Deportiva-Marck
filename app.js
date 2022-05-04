const express = require('express');
const cors = require('cors');
var app = express();

/* Rutas */
const usuarioRutas = require('./src/routes/usuario.routes');

/* Middlewares */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Cors para cabeceras */
app.use(cors());

/* Carga de rutas con api */
app.use('/api' , usuarioRutas);

/* Exportacion */
module.exports = app;