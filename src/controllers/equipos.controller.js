const Equipos = require("../models/equipos.model")

function registrarEquipos(req, res) {
    var modeloEquipos = new Equipos();
    var parametros = req.body;
    var idLiga = req.params.idLiga;
  
    if(parametros.nombre) {
        
    Equipos.find({ nombre: parametros.nombre }, (err, equipoEncontrado) => {
      if (equipoEncontrado.length > 0) {
        return res.status(500).send({ message: "Ya existe este Equipo"});
        
      } else {
        
        
        Equipos.find({ idLiga: idLiga }, (err, equiposLiga) => {

        if (equiposLiga.length >= 10) {
            return res.status(500).send({ message: "No puede tener mas de 10 equipos por Liga"});
                
        } else {
            
        modeloEquipos.nombre = parametros.nombre;
        modeloEquipos.idUsuario = req.user.sub;
        modeloEquipos.idLiga = idLiga;
        modeloEquipos.puntuaje = 0;
        modeloEquipos.golesAFavor = 0;
        modeloEquipos.golesEnContra = 0;
        modeloEquipos.diferenciaDeGoles = 0;
  
          modeloEquipos.save((err, equipoGuardado) => {
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if (!equipoGuardado) return res.status(500).send({mensaje: "Error al registrarEquipo"});
  
            return res.status(200).send({equipo: equipoGuardado});
          });
        }

        })  
      }
    });
}else{
    return res.status(500).send({mensaje: "Debe enviar los parametros obligatorios"})
}

  }


  function editarEquipos(req, res) {
    var idEquipo = req.params.idEquipo;
    var parametros = req.body;
    
    if(parametros.nombre) {
    Equipos.find({ nombre: parametros.nombre }, (err, equipoEncontrado) => {
        if (equipoEncontrado.length > 0) {
          return res.status(500).send({ message: "Ya existe este Equipo"});
          
        } else {
            
    Equipos.findOne({_id: idEquipo ,idUsuario: req.user.sub }, (err, ligaEncontrado) => {
    if (!ligaEncontrado){ 
        return res.status(500).send({mensaje: "Este Equipo no es tuyo"})
        
    } else {
        
    Equipos.findByIdAndUpdate(
        idEquipo,
        {
          $set: {
            nombre: parametros.nombre
          },
        },
        { new: true },
        (err, equipoActualizado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion de editar Equipo" });
          if (!equipoActualizado)
            return res.status(500).send({ mensaje: "Error al editar Equipo" });
          return res.status(200).send({ equipo: equipoActualizado });
        }
      );


    }
    });
}
});
}else{
  return res.status(500).send({mensaje: "Debe enviar los parametros obligatorios"})
}
  }

  function eliminarEquipos(req, res) {
    var idEquipo = req.params.idEquipo;
  
    Equipos.findOne({_id: idEquipo ,idUsuario: req.user.sub }, (err, equipoEncontrado) => {
        if (!equipoEncontrado){ 
            return res.status(500).send({mensaje: "Este Equipo no es tuyo"})
            
        } else {

    Equipos.findByIdAndDelete(idEquipo, (err, equipoEliminado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion de eliminar Equipo" });
      if (!equipoEliminado)
        return res.status(500).send({ mensaje: "Error al eliminar el Equipo" });
  
      return res.status(200).send({ equipo: equipoEliminado });
    });

}
});

  }

  function mostrarEquipos(req, res) {

    Equipos.findOne({idUsuario: req.user.sub }, (err, equipoEncontrado) => {
        if (!equipoEncontrado){ 
            return res.status(500).send({mensaje: "Esta Liga no es tuya"})
            
        } else {

    Equipos.find({idUsuario: req.user.sub }, (err, equipoEncontrado) => {
      return res.status(200).send({equipo: equipoEncontrado});
    })
}
});
  }

  function mostrarEquiposLiga(req, res) {
    var idLiga = req.params.idLiga;

    Equipos.findOne({idUsuario: req.user.sub }, (err, equipoEncontrado) => {
        if (!equipoEncontrado){ 
            return res.status(500).send({mensaje: "Este equipo no es tuyo"})
            
        } else {

    Equipos.find({idLiga: idLiga }, (err, equipoEncontrado) => {
      return res.status(200).send({equipo: equipoEncontrado});
    })
}
});
  }

  module.exports = {
    registrarEquipos,
    editarEquipos,
    eliminarEquipos,
    mostrarEquipos,
    mostrarEquiposLiga
  }