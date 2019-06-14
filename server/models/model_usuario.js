const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = { //enuemacion de roles- objeto con sus propiedades
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido' //{VALUE} inyecta lo que escriba el usuario
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] //[]-permite colocar msj personalizado 
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true //cuando se cree un usuario estara en estado activo
    },
    google: {
        type: Boolean,
        default: false //sino se creea con la propiedad de google, sera un usuario normal

    }
});

usuarioSchema.methods.toJSON = function() { //no dar pssword en la respuesta cuando es JSON

    let user = this;
    let userObject = user.toObject(); //se tienen las propiedades y metodos
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);