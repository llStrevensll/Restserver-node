/* Aqui se declararan variables, constantes de forma global

process--Es un objeto global que esta corriendo a lo largo de toda la aplicacion de node
Este tambien es actualizado dependiendo del enviroment o entorno donde este corriendo
*/


//==========
// Puerto
//==========
process.env.PORT = process.env.PORT || 3000;

//===============
// Entorno
//===============
/*Si la variable exite esta en produccion, sino en desarrollo */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
// Vencimiento del Token
//=========================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=========================
// Seed de autenticación
//=========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//===============
// Base de datos
//===============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//=====================
// Google Client ID
//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '107865897727-5jj73s3t75p4maqbh6ab62pmuf5336cs.apps.googleusercontent.com';