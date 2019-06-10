require('./config/config'); //configura lo que se encuentre en el archivo config

const express = require('express')
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //use - funcion que se dispara cada vez que se dispare el codigo(peticiones)

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

app.post('/usuario', function(req, res) {

    let body = req.body; //es el body, cuando el bodyparser procese cualquier pedido que reciban las peticiones

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; // el .id debe ser igual al /:id
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});