const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/model_usuario'); //Objeto usado para crear nuevos elementos de ese esquema
const { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion'); //destructuracion

const app = express();



app.get('/usuario', verificaToken, (req, res) => { //Middleware segundo argumento

    /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    }); */


    let desde = req.query.desde || 0; //sino tiene filtrado, entonces quiere desde la primera 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') // {google: true} filtrar busqueda
        .skip(desde) //salta los registros hasta el especificado
        .limit(limite)
        .exec((err, usuarios) => { //ejecuta--- usuario: arreglo
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body; //es el body, cuando el bodyparser procese cualquier pedido que reciban las peticiones
    /*console.log('body: ', body.email);*/

    let usuario = new Usuario({ //instancia el esquema con las propiedades y metodos de mongoose
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //numero de veces que aplica el hash
        role: body.role
    });

    /** console.log('usuario: ', usuario.email);*/
    //save -palabra reservada de mongoose
    usuario.save((err, usuarioDB) => { //(error, usuario que se guardo en la bd)
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id; // el .id debe ser igual al /:id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); /**pick: Return a copy of the object, filtered to only have values for the whitelisted keys */


    /* delete body.password;
    delete body.google; */ //ineficiente cuando son muchos objetos

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //funcion mongoose
        //{id, update, object-new: true-retorna informacion actualizada-runvalidators: valida las restricciones presentadas en el esquema, callback}

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;


    /**Eiminar directamente de la BD */
    /*
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });*/

    /**Cambiar su estado a false- sin elminar directamente de la BD */
    let cambioEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
});

module.exports = app;