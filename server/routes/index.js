const express = require('express');
const app = express();


app.use(require('./routes_usuario'));
app.use(require('./login'));


module.exports = app;