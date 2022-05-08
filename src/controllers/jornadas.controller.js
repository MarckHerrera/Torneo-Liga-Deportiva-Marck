const Jornadas = require("../models/jornadas.model")
const Equipos = require("../models/equipos.model");
const parse = require("nodemon/lib/cli/parse");

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

    if (parametros.equipo1, parametros.equipo2) {

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
                                                                        }]
                                                                    },
                                                                },
                                                                { new: true },
                                                                (err, jornadaActualizado) => {
                                                                    if (err)
                                                                        return res.status(500).send({ mensaje: "Error en la peticion de editar Jornada" });
                                                                    if (!jornadaActualizado)
                                                                        return res.status(500).send({ mensaje: "Error al editar Jornada" });
                                                                    return res.status(200).send({ jornada: jornadaActualizado });
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
                                                                        }]
                                                                    },
                                                                },
                                                                { new: true },
                                                                (err, jornadaActualizado) => {
                                                                    if (err)
                                                                        return res.status(500).send({ mensaje: "Error en la peticion de editar Jornada" });
                                                                    if (!jornadaActualizado)
                                                                        return res.status(500).send({ mensaje: "Error al editar Jornada" });
                                                                    return res.status(200).send({ jornada: jornadaActualizado });
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

module.exports = {
    registrarJornadas,
    agregarPartido
}