const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquiposSchema = Schema({
    nombre: String,
    idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
    idLiga: {type: Schema.Types.ObjectId, ref: "Ligas"},
    puntuaje: Number,
    golesAFavor: Number,
    golesEnContra: Number,
    diferenciaDeGoles: Number
})

module.exports = mongoose.model('Equipos', EquiposSchema)