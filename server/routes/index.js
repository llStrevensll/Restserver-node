const express = require('express');
const app = express();


app.use(require('./routes_usuario'));
app.use(require('./login'));
app.use(require('./routes_categoria'));
app.use(require('./routes_producto'));


module.exports = app;