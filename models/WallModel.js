const mongoose = require('mongoose');

let WallSchema = new mongoose.Schema({
    wallName: { //墙的标题(显示网页中)
        type: String,
        required: true
    },

    size: { 
        type: [Number],
        required: true,
        unique: true
    },

    logo: {
        type: String,
        required: true
    }
});

let WallModel = mongoose.model('walls', WallSchema);

module.exports = WallModel;
