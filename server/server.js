require('./config/config'); //configura lo que se encuentre en el archivo config

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //use - funcion que se dispara cada vez que se dispare el codigo(peticiones)

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/routes_usuario'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');

    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});