const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    tel: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
});

let UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
