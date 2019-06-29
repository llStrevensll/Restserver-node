const express = require('express');

const fs = require('fs');
const path = require('path');

let { verificaTokenImg } = require('../middleware/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath); //lee el content-type del archivo y lo retorna-> si es img devuelve la img
    }





});


module.exports = app;