const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/model_usuario');
const Producto = require('../models/model_producto');

const fs = require('fs'); //filesystem
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));
/*todos los archivos que se carguen caen dentro de req.files, 
 decir que el middleware fileUpload() toma el archivo que se este subiendo y lo coloca en el objeto files*/
/**Se debe añadir useTempFiles: true, sino los archivos se subiran, pero vacios */

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }


    //Validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '), //unir
            }
        });
    }

    let archivo = req.files.archivo; //Obtener el archivo
    let nombreCortado = archivo.name.split('.'); //Dividir el nombre del archivo 'nombre' - 'extension'
    let extension = nombreCortado[nombreCortado.length - 1]; //Obtener la extensión del archivo
    //console.log(extension);


    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) { //indexof buscar en el arreglo la extension
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitadas son ' + extensionesValidas.join(', '), //unir
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Imagen Cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });
});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}


function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); //construir un path en especifico
    if (fs.existsSync(pathImagen)) { //Verificar que exista
        fs.unlinkSync(pathImagen); //Si existe - elimina con el path del archivo
    }
}

module.exports = app;