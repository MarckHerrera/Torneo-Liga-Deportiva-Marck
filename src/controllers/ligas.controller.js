const Ligas = require("../models/ligas.model");

/* Funciones de usuario */
function registrarLigas(req, res) {
  var modeloLigas = new Ligas();
  var parametros = req.body;


  if (parametros.nombre) {

    Ligas.find({ nombre: parametros.nombre }, (err, ligaEncontrado) => {
      if (ligaEncontrado.length > 0) {
        return res.status(500).send({ message: "Ya existe esta Liga" });

      } else {
        modeloLigas.nombre = parametros.nombre;
        modeloLigas.idUsuario = req.user.sub;


        modeloLigas.save((err, ligaGuardado) => {
          if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!ligaGuardado) return res.status(500).send({ mensaje: "Error al registrarLiga" });

          return res.status(200).send({ liga: ligaGuardado });
        });
      }
    });

  } else {
    return res.status(500).send({ mensaje: "Debe enviar los parametros obligatorios" })
  }

}

function editarLigas(req, res) {
  var idLiga = req.params.idLiga;
  var parametros = req.body;

  Ligas.find({ nombre: parametros.nombre }, (err, ligaEncontrado) => {
    if (ligaEncontrado.length > 0) {
      return res.status(500).send({ message: "Ya existe esta Liga" });

    } else {

      Ligas.findOne({ idUsuario: req.user.sub }, (err, usuarioEncontrado) => {
        if (req.user.rol == "ROL_USUARIO") {

          Ligas.findOne({ _id: idLiga, idUsuario: req.user.sub }, (err, ligaEncontrado) => {
            if (!ligaEncontrado) {
              return res.status(500).send({ mensaje: "Esta Liga no es tuya" })

            } else {


              Ligas.findByIdAndUpdate(
                idLiga,
                {
                  $set: {
                    nombre: parametros.nombre
                  },
                },
                { new: true },
                (err, ligaActualizado) => {
                  if (err)
                    return res.status(500).send({ mensaje: "Error en la peticion de editar liga" });
                  if (!ligaActualizado)
                    return res.status(500).send({ mensaje: "Error al editar liga" });
                  return res.status(200).send({ liga: ligaActualizado });
                }
              );


            }
          });

        }
        else if (req.user.rol == "ROL_ADMIN") {
          Ligas.findByIdAndUpdate(
            idLiga,
            {
              $set: {
                nombre: parametros.nombre
              },
            },
            { new: true },
            (err, ligaActualizado) => {
              if (err)
                return res.status(500).send({ mensaje: "Error en la peticion de editar liga" });
              if (!ligaActualizado)
                return res.status(500).send({ mensaje: "Error al editar liga" });
              return res.status(200).send({ liga: ligaActualizado });
            }
          );
        }
      })
    }
  });

}

function eliminarLigas(req, res) {
  var idLiga = req.params.idLiga;


  Ligas.findOne({ idUsuario: req.user.sub }, (err, usuarioEncontrado) => {
    if (req.user.rol == "ROL_USUARIO") {

      Ligas.findOne({ _id: idLiga, idUsuario: req.user.sub }, (err, ligaEncontrado) => {
        if (!ligaEncontrado) {
          return res.status(500).send({ mensaje: "Esta Liga no es tuya" })

        } else {

          Ligas.findByIdAndDelete(idLiga, (err, ligaEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!ligaEliminado)
              return res.status(500).send({ mensaje: "Error al eliminar el Torneo" });

            return res.status(200).send({ liga: ligaEliminado });
          });

        }

      });
    } else if (req.user.rol == "ROL_ADMIN") {
      Ligas.findByIdAndDelete(idLiga, (err, ligaEliminado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligaEliminado)
          return res.status(500).send({ mensaje: "Error al eliminar el Torneo" });

        return res.status(200).send({ liga: ligaEliminado });
      });
    }
  })
}

function mostrarLigas(req, res) {

  if (req.user.rol == "ROL_USUARIO") {
  Ligas.findOne({ idUsuario: req.user.sub }, (err, ligaEncontrado) => {
    if (!ligaEncontrado) {
      return res.status(500).send({ mensaje: "Esta Liga no es tuya" })

    } else {

      Ligas.find({ idUsuario: req.user.sub }, (err, ligasEncontrado) => {
        return res.status(200).send({ liga: ligasEncontrado });
      })
    }
  });
} else if (req.user.rol == "ROL_ADMIN") {

  Ligas.find({ idUsuario: req.user.sub }, (err, ligasEncontrado) => {
    return res.status(200).send({ liga: ligasEncontrado });
  })
}
}
/* Fin Funciones de usuario */

module.exports = {
  registrarLigas,
  editarLigas,
  eliminarLigas,
  mostrarLigas
};