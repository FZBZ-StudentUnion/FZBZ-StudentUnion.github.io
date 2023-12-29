const mongoose = require('mongoose');

let VideoSchema = new mongoose.Schema({
    wallId: { // 视频所在墙的ID
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    extname: { // 视频的后缀名
        type: String,
        required: true
    }
/*
    index: {
        type: Number,
        required: true,
        unique: true
    }*/
});

let VideoModel = mongoose.model('videos', VideoSchema);

module.exports = VideoModel;
