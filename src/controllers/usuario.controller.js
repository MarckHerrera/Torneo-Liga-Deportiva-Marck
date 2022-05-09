const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

/* Funciones de admin */
  /* Funciones admin para usuarios */
    /* admin que se crea al principio */
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

  function mostrarUsuarios(req, res) {
    Usuario.find({rol:"ROL_USUARIO"}, (err, usuarioEncontrado) => {
      return res.status(200).send({usuario: usuarioEncontrado});
    })
  }
  
  
  /*Fin Funciones admin para usuarios */
/* Fin de funciones admin */

/* Funciones de TODOS */
  function registrarUsuario(req, res) {
    var modeloUsuario = new Usuario();
    var parametros = req.body;
  
    if(parametros.nombre && parametros.email && parametros.password) {
        
    Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {

      if (usuarioEncontrado.length > 0) {
        return res.status(500).send({ message: "Ya existe ese email"});
        
      } else {
        modeloUsuario.nombre = parametros.nombre;
        modeloUsuario.email = parametros.email;
        modeloUsuario.password = parametros.password;
        modeloUsuario.rol = "ROL_USUARIO";
  
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          modeloUsuario.password = passwordEncriptada;
  
          modeloUsuario.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if (!usuarioGuardado) return res.status(500).send({mensaje: "Error al registrarUsuario"});
  
            return res.status(200).send({usuario: usuarioGuardado});
          });
        });
      }
    });
}else{
    return res.status(500).send({mensaje: "Debe enviar los parametros obligatorios"})
}

  }

  function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (usuarioEncontrado) {
        bcrypt.compare(
          parametros.password,
          usuarioEncontrado.password,
          (err, verificacionPassword) => {
            if (verificacionPassword) {
              if (parametros.obtenerToken === "true") {
                return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
              } else {
                usuarioEncontrado.password = undefined;
                return res.status(200).send({ usuario: usuarioEncontrado });
              }
            } else {
              return res.status(500).send({ mensaje: "Las contrasena no coincide" });
            }
          }
        );
      } else {
        return res.status(500).send({ mensaje: "Error, el correo no se encuentra registrado." });
      }
    });
  }


  function registrarAdmin(req, res) {
    var modeloUsuario = new Usuario();
    var parametros = req.body;
  
    if(parametros.nombre && parametros.email && parametros.password) {
        
    Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {

      if (usuarioEncontrado.length > 0) {
        return res.status(500).send({ message: "Ya existe ese email"});
        
      } else {
        modeloUsuario.nombre = parametros.nombre;
        modeloUsuario.email = parametros.email;
        modeloUsuario.password = parametros.password;
        modeloUsuario.rol = "ROL_ADMIN";
  
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          modeloUsuario.password = passwordEncriptada;
  
          modeloUsuario.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if (!usuarioGuardado) return res.status(500).send({mensaje: "Error al registrarUsuario"});
  
            return res.status(200).send({usuario: usuarioGuardado});
          });
        });
      }
    });
}else{
    return res.status(500).send({mensaje: "Debe enviar los parametros obligatorios"})
}

  }

  function editarUsuarios(req, res) {
    var idUser = req.params.idUser;
    var parametros = req.body;


      Usuario.find({ nombre: parametros.nombre }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
          return res.status(500).send({ message: "Ya existe este Usuario"});
          
        } else {
  
    Usuario.findOne({ _id: idUser }, (err, usuarioEncontrado) => {
      if (req.user.rol == "ROL_ADMIN") {
        if (usuarioEncontrado.rol !== "ROL_USUARIO") {
          return res.status(500).send({ mensaje: "No puede editar a otros administradores" });
        } else {
          Usuario.findByIdAndUpdate(
            idUser,
            {
              $set: {
                nombre: parametros.nombre,
                email: parametros.email
              },
            },
            { new: true },
            (err, usuarioActualizado) => {
              if (err)
                return res.status(500).send({ mensaje: "Error en la peticion de editar-admin" });
              if (!usuarioActualizado)
                return res.status(500).send({ mensaje: "Error al editar usuario" });
              return res.status(200).send({ usuario: usuarioActualizado });
            }
          );
        }
      } else {
        Usuario.findByIdAndUpdate(
          req.user.sub,
          {
            $set: {
                nombre: parametros.nombre,
                email: parametros.email  
            },
          },
          { new: true },
          (err, usuarioActualizado) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioActualizado)
              return res.status(500).send({ mensaje: "Error al editar el Usuario" });
  
            return res.status(200).send({ usuario: usuarioActualizado });
          }
        );
      }
    });
    
  }
});

  }

  function eliminarUsuarios(req, res) {
    var idUser = req.params.idUser;
  
    if (req.user.rol !== "ROL_ADMIN") {
      return res.status(500).send({ mensaje: "No tiene los permisos para eliminar Admins." });
    }
  
    if (req.user.sub == idUser) {
      console.log(req.user.nombre);
      return res.status(500).send({ mensaje: "El admin no se puede borrar" });
    }
  
    Usuario.findByIdAndDelete(idUser, (err, UsuarioEliminado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!UsuarioEliminado)
        return res.status(500).send({ mensaje: "Error al eliminar el producto" });
  
      return res.status(200).send({ usuario: UsuarioEliminado });
    });
  }
/* Fin Funciones de TODOS */
  
  


module.exports = {
    adminDefault,
    registrarUsuario,
    Login,
    editarUsuarios,
    eliminarUsuarios,

    registrarAdmin,
    mostrarUsuarios
};