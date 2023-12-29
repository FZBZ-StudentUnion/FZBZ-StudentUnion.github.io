const mongoose = require('mongoose');

let PhotoSchema = new mongoose.Schema({
    wallId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    extname: {
        type: String,
        required: true
    },
/*
    index: {
        type: Number,
        required: true,
        unique: true
    }*/
});

let PhotoModel = mongoose.model('photos', PhotoSchema);

module.exports = PhotoModel;
