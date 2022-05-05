const express = require('express')
const controladorUsuario = require('../controllers/usuario.controller')

/* Middlewares */
const md_auth = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

/* Rutas de Usuarios */
api.post('/registarUsuario', controladorUsuario.registrarUsuario);
api.post('/Login', controladorUsuario.Login);
api.put('/editarUsuario/:idUser?',md_auth.Auth, controladorUsuario.editarUsuarios);
api.delete('/eliminarUsuario/:idUser',md_auth.Auth, controladorUsuario.eliminarUsuarios);

/* Especificas del Admin */
api.post('/registarAdmin',[md_auth.Auth, md_roles.administrador], controladorUsuario.registrarAdmin);
api.get('/mostrarUsuarios',[md_auth.Auth, md_roles.administrador], controladorUsuario.mostrarUsuarios);
    /* Especificas del Admin Torneos */
api.post('/registrarTorneo',[md_auth.Auth, md_roles.administrador], controladorUsuario.registrarTorneos);
api.put('/editarTorneo/:idTorneo',[md_auth.Auth, md_roles.administrador], controladorUsuario.editarTorneos);
api.delete('/eliminarTorneo/:idTorneo',[md_auth.Auth, md_roles.administrador], controladorUsuario.eliminarTorneos);
api.get('/mostrarTorneos',[md_auth.Auth, md_roles.administrador], controladorUsuario.mostrarTorneos);

module.exports = api;