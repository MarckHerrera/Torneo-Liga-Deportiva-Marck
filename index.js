const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb://localhost:27017/TorneosDeportivos', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Conectado a la base de datos.");

    /* Aqui va a ir el usuario admin defecto :b */


    app.listen(3000, function () {
        console.log("Corriendo en el puerto 3000!")
    })

}).catch(error => console.log(error));