const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JornadasSchema = Schema({
    nombre: String,
    idLiga: {type: Schema.Types.ObjectId, ref: "Ligas"},
    partidos: [{
            equipo1: String,
            equipo2: String,
            marcador: String,
    }],
})

module.exports = mongoose.model('Jornadas', JornadasSchema)