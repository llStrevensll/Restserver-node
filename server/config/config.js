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

//===============
// Base de datos
//===============
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strevens:EeDwv0yvdwfmX5hF@cafe-zewfs.mongodb.net/cafe';
}
process.env.URLDB = urlDB;