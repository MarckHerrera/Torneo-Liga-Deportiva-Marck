const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigasSchema = Schema({
    nombre: String,
    idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
    idTorneo: {type: Schema.Types.ObjectId, ref: "Torneos"}
})

module.exports = mongoose.model('Ligas', LigasSchema)