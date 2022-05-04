const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function adminDefault() {
    var modeloUsuario = new Usuario();
  
    Usuario.find({ email: "ADMIN" }, (err, usuarioEncontrado) => {

      if (usuarioEncontrado.length > 0) {
        return console.log("Ya existe un ADMIN");
        
      } else {
        modeloUsuario.nombre = "ADMIN";
        modeloUsuario.email = "ADMIN";
        modeloUsuario.rol = "ROL_ADMIN";
  
        bcrypt.hash("deportes123", null, null, (err, passwordEncriptada) => {
          modeloUsuario.password = passwordEncriptada;
  
          modeloUsuario.save((err, usuarioGuardado) => {
            if (err) return console.log("Error en la peticion");
            if (!usuarioGuardado) return console.log("Error al registrar ADMIN");
  
            return console.log("Admin por Deafault:" + " " + usuarioGuardado);
          });
        });
      }
    });
  }

module.exports = {
    adminDefault
};