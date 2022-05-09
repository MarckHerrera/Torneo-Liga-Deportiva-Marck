const Jornadas = require("../models/jornadas.model")
const Equipos = require("../models/equipos.model");
const Ligas = require("../models/ligas.model");
const parse = require("nodemon/lib/cli/parse");
const Pdfkit = require("pdfkit");
const fs = require("fs");
var doc = new Pdfkit();



function registrarJornadas(req, res) {
    var modeloJornada = new Jornadas();
    var parametros = req.body;
    var idLiga = req.params.idLiga;

    if (parametros.nombre) {

        Jornadas.find({ nombre: parametros.nombre }, (err, jornadaEncontrado) => {

            if (jornadaEncontrado.length > 0) {
                return res.status(500).send({ message: "Ya existe esta Jornada" });

            } else {

                Jornadas.find({ idLiga: idLiga }, (err, jornadasLiga) => {
                    Equipos.find({ idLiga: idLiga }, (err, equiposLiga) => {

                        if (equiposLiga.length % 2 == 0) {
                            if (jornadasLiga.length >= equiposLiga.length - 1) {
                                return res.status(500).send({ message: "Las jornadas deben terner una menos que el total de equipos si es par" });
                            } else {
                                modeloJornada.nombre = parametros.nombre;
                                modeloJornada.idLiga = idLiga;


                                modeloJornada.save((err, jornadaGuardado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!jornadaGuardado) return res.status(500).send({ mensaje: "Error al registrarJornada" });

                                    return res.status(200).send({ usuario: jornadaGuardado });
                                });
                            }

                        } else if (equiposLiga.length % 2 == 1) {

                            if (jornadasLiga.length >= equiposLiga.length) {
                                return res.status(500).send({ message: "Las jornadas deben terner la misma cantidad que los equipos si es impar" });

                            } else {
                                modeloJornada.nombre = parametros.nombre;
                                modeloJornada.idLiga = idLiga;

                                modeloJornada.save((err, jornadaGuardado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!jornadaGuardado) return res.status(500).send({ mensaje: "Error al registrarJornada" });

                                    return res.status(200).send({ usuario: jornadaGuardado });
                                });
                            }
                        } else {
                            return res.status(500).send({ mensaje: "error en la peticion de equipos para jornadas" })
                        }
                    })
                })
            }
        });
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parametros obligatorios" })
    }

}

function agregarPartido(req, res) {
    var idJornada = req.params.idJornada;
    var parametros = req.body;
    const golesUno = parametros.goles1;
    const golesDos = parametros.goles2;
    const diferencia1 = golesUno - golesDos;
    const diferencia2 = golesDos - golesUno;

    if (parametros.equipo1, parametros.equipo2, parametros.goles1, parametros.goles2) {
        Equipos.findOne({ nombre: parametros.equipo1 }, (err, equipo1Encontrado) => {
            if (!equipo1Encontrado) {
                return res.status(500).send({ message: "equipo1 no encontrado" })
            }
            if (equipo1Encontrado == null) {
            } else {
                Equipos.findOne({ nombre: parametros.equipo2 }, (err, equipo2Encontrado) => {
                    if (!equipo2Encontrado) {
                        return res.status(500).send({ message: "equipo2 no encontrado" })
                    }
                    if (equipo2Encontrado == null) {
                    } else {
                        Jornadas.findOne({ _id: idJornada, partidos: { $elemMatch: { equipo1: parametros.equipo1 } } }, (err, nombrePartidoJornada) => {
                            if (nombrePartidoJornada) {
                                return res.status(500).send({ message: "ya ha sido creado 1" })
                            }
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                            if (!nombrePartidoJornada) {
                                Jornadas.findOne({ _id: idJornada, partidos: { $elemMatch: { equipo2: parametros.equipo2 } } }, (err, nombrePartidoJornada2) => {
                                    if (nombrePartidoJornada2) {
                                        return res.status(500).send({ message: "ya ha sido creado 2" })
                                    }
                                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                                    if (!nombrePartidoJornada2) {

                                        Jornadas.findById(idJornada, { idLiga: 1, _id: 0 }, (err, idLigaJornada) => {
                                            Jornadas.findById(idJornada, { partidos: 1, _id: 0 }, (err, partidosJornada) => {
                                                Equipos.find({ idLigaJornada }, (err, equiposLiga) => {

                                                    if (equiposLiga.length % 2 == 0) {
                                                        if (partidosJornada.partidos.length >= equiposLiga.length / 2) {
                                                            return res.status(500).send({ message: "Las jornadas deben terner una menos que el total de equipos si es par" });
                                                        } else {

                                                            Jornadas.findByIdAndUpdate(
                                                                idJornada,
                                                                {
                                                                    $push: {
                                                                        partidos: [{
                                                                            equipo1: parametros.equipo1,
                                                                            equipo2: parametros.equipo2,
                                                                            goles1: parametros.goles1,
                                                                            goles2: parametros.goles2,
                                                                        }]
                                                                    },
                                                                },
                                                                { new: true },
                                                                (err, jornadaActualizado) => {
                                                                    if (err)
                                                                        return res.status(500).send({ mensaje: "Error en la peticion de editar Jornada" });
                                                                    if (!jornadaActualizado)
                                                                        return res.status(500).send({ mensaje: "Error al editar Jornada" });
                                                                    if (jornadaActualizado) {
                                                                        return res.status(200).send({ jornada: jornadaActualizado });
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    } else if (equiposLiga.length % 2 == 1) {

                                                        if (partidosJornada.partidos.length >= (equiposLiga.length - 1) / 2) {
                                                            return res.status(500).send({ message: "Las jornadas deben terner la misma cantidad que los equipos si es impar" });

                                                        } else {

                                                            Jornadas.findByIdAndUpdate(
                                                                idJornada,
                                                                {
                                                                    $push: {
                                                                        partidos: [{
                                                                            equipo1: parametros.equipo1,
                                                                            equipo2: parametros.equipo2,
                                                                            goles1: parametros.goles1,
                                                                            goles2: parametros.goles2,
                                                                        }]
                                                                    },
                                                                },
                                                                { new: true },
                                                                (err, jornadaActualizado) => {
                                                                    if (err)
                                                                        return res.status(500).send({ mensaje: "Error en la peticion de editar Jornada" });
                                                                    if (!jornadaActualizado)
                                                                        return res.status(500).send({ mensaje: "Error al editar Jornada" });
                                                                    // return res.status(200).send({ jornada:jornadaActualizado});
                                                                    if (golesUno == golesDos) {//empate
                                                                        let empate = 1;
                                                                        Equipos.findOneAndUpdate({ nombre: parametros.equipo1 }, {
                                                                            $inc: {
                                                                                puntuaje: empate, golesAFavor: golesUno,
                                                                                golesEnContra: golesDos, diferenciaDeGoles: diferencia1
                                                                            }
                                                                        }, { new: true }, (err, EquiposActualizado1) => {

                                                                            //return res.status(200).send({ equipoafectado: EquiposActualizado1});
                                                                            console.log({ equipoafectado: EquiposActualizado1 });
                                                                            Equipos.findOneAndUpdate({ nombre: parametros.equipo2 }, {
                                                                                $inc: {
                                                                                    puntuaje: empate, golesAFavor: golesDos,
                                                                                    golesEnContra: golesUno, diferenciaDeGoles: diferencia2
                                                                                }
                                                                            }, { new: true }, (err, EquiposActualizado2) => {

                                                                                return res.status(200).send({ equipoafectados: EquiposActualizado1, EquiposActualizado2 });
                                                                            })
                                                                        })
                                                                    } else if (golesUno > golesDos) { //gano equipo 1
                                                                        let gano = 3;
                                                                        let perdio = 0;
                                                                        Equipos.findOneAndUpdate({ nombre: parametros.equipo1 }, {
                                                                            $inc: {
                                                                                puntuaje: gano, golesAFavor: golesUno,
                                                                                golesEnContra: golesDos, diferenciaDeGoles: diferencia1
                                                                            }
                                                                        }, { new: true }, (err, EquiposActualizado1) => {
                                                                            console.log({ equipoafectado: EquiposActualizado1 });
                                                                            Equipos.findOneAndUpdate({ nombre: parametros.equipo2 }, {
                                                                                $inc: {
                                                                                    puntuaje: perdio, golesAFavor: golesDos,
                                                                                    golesEnContra: golesUno, diferenciaDeGoles: diferencia2
                                                                                }
                                                                            }, { new: true }, (err, EquiposActualizado2) => {

                                                                                return res.status(200).send({ equipoafectados: EquiposActualizado1, EquiposActualizado2 });
                                                                            })
                                                                        })
                                                                    } else if (golesDos >= golesUno) {// gano equipo 2 
                                                                        let gano = 3;
                                                                        let perdio = 0;
                                                                        Equipos.findOneAndUpdate({ nombre: parametros.equipo1 }, {
                                                                            $inc: {
                                                                                puntuaje: perdio, golesAFavor: golesUno,
                                                                                golesEnContra: golesDos, diferenciaDeGoles: diferencia1
                                                                            }
                                                                        }, { new: true }, (err, EquiposActualizado1) => {
                                                                            console.log({ equipoafectado: EquiposActualizado1 });
                                                                            Equipos.findOneAndUpdate({ nombre: parametros.equipo2 }, {
                                                                                $inc: {
                                                                                    puntuaje: gano, golesAFavor: golesDos,
                                                                                    golesEnContra: golesUno, diferenciaDeGoles: diferencia2
                                                                                }
                                                                            }, { new: true }, (err, EquiposActualizado2) => {

                                                                                return res.status(200).send({ equipoafectados: EquiposActualizado1, EquiposActualizado2 });
                                                                            })
                                                                        })
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    } else {
                                                        return res.status(500).send({ mensaje: "error en la peticion de equipos para jornadas" })
                                                    }
                                                })
                                            })
                                        })

                                    }

                                })
                            }
                        })
                    }
                })
            }
        }

        );
    } else {
        return res.status(500).send({ mensaje: "Debe enviar los parametros obligatorios" })
    }
}

function tablaGeneral(req, res) {
    var idLiga = req.params.idLiga;

    Equipos.findOne({idUsuario: req.user.sub }, (err, equipoEncontrado) => {
        if (!equipoEncontrado){ 
            return res.status(500).send({mensaje: "Este equipo no es tuyo"})
            
        } else {

    Equipos.find({idLiga: idLiga },{idLiga:0,idUsuario:0,_id:0,__v:0}, (err, equipoEncontrado) => {
      return res.status(200).send({equipo: equipoEncontrado});
    }).sort({puntuaje:-1})
}
});
}

function tablitaPdf(req, res) {
    var idLiga = req.params.idLiga;

    Ligas.findOne({ _id: idLiga }, (err, ligaEncontrado) => {
        const topY = 80;
        const topX = 30;
        const pX = 500;
        const pY = 1000;
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#A39FA7');
    doc.fillColor("#891616").fontSize(32).text("Tabla de liga",topY,topX, {align: "center",bold: true,});
    doc.rect(0, 150, pY, pX).fill('#FFFFFF');
      doc
        .fillColor("#891616")
        .fontSize(32)
        .text(ligaEncontrado.nombre, { align: "center", bold: true, underline: true })
    })
    Equipos.findOne({idUsuario: req.user.sub }, (err, equipoEncontrado) => {
        
        if (!equipoEncontrado){ 
            return res.status(500).send({mensaje: "Este equipo no es tuyo"})
            
        } else {

    Equipos.find({idLiga: idLiga },{idUsuario:0,_id:0,__v:0}, (err, equipoEncontrado) => {
      
        doc.pipe(fs.createWriteStream("pdfs/" + idLiga + ".pdf"));
          const Top = 200;
          const EquipoX = 50;
          const palitoX = 300;
          const pepeX = 300;
          const PtsX = 350;
          const GfX = 400;
          const GcX = 450;
          const df = 500;

          doc
            .fontSize(18)
            .text("Equipos: " +equipoEncontrado.length, EquipoX, Top, {
              bold: true,
              underline: true,
              
            })
            
            .text("|", pepeX, Top, {bold: true,})
            .text("Pts", PtsX, Top, {bold: true, underline: true,})
            .text("GF", GfX, Top, { bold: true, underline: true })
            .text("GC", GcX, Top, { bold: true, underline: true })
            .text("DF", df, Top, { bold: true, underline: true });


          let i = 0;
          for (i = 0; i < equipoEncontrado.length; i++) {
            const y = Top + 25 + i * 25;

            doc.text(equipoEncontrado[i].nombre, EquipoX, y);
            doc.text("|", palitoX, y);
            doc.text(equipoEncontrado[i].puntuaje, PtsX, y);
            doc.text(equipoEncontrado[i].golesAFavor, GfX, y);
            doc.text(equipoEncontrado[i].golesEnContra, GcX, y);
            doc.text(equipoEncontrado[i].diferenciaDeGoles, df, y);
          }

          
        

          doc.end();

    }).sort({puntuaje:-1})
}
});
return res.status(200).send("Se creo un Pdf");
}

module.exports = {
    registrarJornadas,
    agregarPartido,
    tablaGeneral,
    tablitaPdf
}