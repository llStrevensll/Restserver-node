const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion');

let app = express();

let Categoria = require('../models/model_categoria');

//================================
//Mostrar todas las Categorias
//================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}) //vacia para enviar despues mas condiciones
        .sort('descripcion')
        .populate('usuario', 'nombre email') //populate: va a verificar los object_id que se encuentran en la categoria que esta especificando (permitiendo cargar información)
        //como segundo argumento se pueden especificar los campos que apareceran
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });

});

//==============================
//Mostrar una categoria por ID
//==============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'ID no valido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//==============================
//Crear nueva Categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

//==============================
//Actualizar categorias
//==============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//==============================
//Elminar Categoria
//==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo el admin puede borrar cateogrias

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    });
});



module.exports = app;