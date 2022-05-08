const express = require('express');
const controladorUsuario = require('../controllers/usuario.controller');
const controladorLigas = require('../controllers/ligas.controller');
const controladorEquipos = require('../controllers/equipos.controller');
const controladorJornadas = require('../controllers/jornadas.controller')

/* Middlewares */
const md_auth = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

/* Rutas de Usuarios y Admin*/
api.post('/registarUsuario', controladorUsuario.registrarUsuario);
api.post('/Login', controladorUsuario.Login);
api.put('/editarUsuario/:idUser?',md_auth.Auth, controladorUsuario.editarUsuarios);
api.delete('/eliminarUsuario/:idUser',md_auth.Auth, controladorUsuario.eliminarUsuarios);

/* Especificas del Admin */
    /* Especificas del Admin Usuarios */
api.post('/registarAdmin',[md_auth.Auth, md_roles.administrador], controladorUsuario.registrarAdmin);
api.get('/mostrarUsuarios',[md_auth.Auth, md_roles.administrador], controladorUsuario.mostrarUsuarios);

/* Especificas del Usuario */
    /* Especificas del Usuario Ligas */
api.post('/registrarLiga',md_auth.Auth, controladorLigas.registrarLigas);
api.put('/editarLiga/:idLiga',md_auth.Auth, controladorLigas.editarLigas);
api.delete('/eliminarLiga/:idLiga',[md_auth.Auth, md_roles.usuarios], controladorLigas.eliminarLigas);
api.get('/mostrarLigas',[md_auth.Auth, md_roles.usuarios], controladorLigas.mostrarLigas);
    /* Especificas del Usuario Equipos */
api.post('/registrarEquipo/:idLiga',[md_auth.Auth, md_roles.usuarios], controladorEquipos.registrarEquipos);
api.put('/editarEquipo/:idEquipo',[md_auth.Auth, md_roles.usuarios], controladorEquipos.editarEquipos);
api.delete('/eliminarEquipo/:idEquipo',[md_auth.Auth, md_roles.usuarios], controladorEquipos.eliminarEquipos);
api.get('/mostrarEquipos',[md_auth.Auth, md_roles.usuarios], controladorEquipos.mostrarEquipos);
api.get('/mostrarEquiposLiga/:idLiga',[md_auth.Auth, md_roles.usuarios], controladorEquipos.mostrarEquiposLiga);
    /* Especificas del Usuario Jornadas */
api.post('/registrarJornada/:idLiga',[md_auth.Auth, md_roles.usuarios],controladorJornadas.registrarJornadas);
api.put('/agregarPartido/:idJornada',[md_auth.Auth, md_roles.usuarios],controladorJornadas.agregarPartido);
    /* Especificas del Usuario Tabla */
api.get('/tablaGeneral/:idLiga',[md_auth.Auth, md_roles.usuarios], controladorJornadas.tablaGeneral);
module.exports = api;