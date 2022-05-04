const express = require('express')
const controladorUsuario = require('../controllers/usuario.controller')

/* Middlewares */
const md_auth = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

module.exports = api;