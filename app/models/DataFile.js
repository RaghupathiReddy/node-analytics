var mongoose = require('mongoose');  

var DataFileSchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    datasetUploadDate: { type: Date, default: Date.now},
    datasetLocation: { type: String, required: true},
    datasetSize: { type: String, required: true},
    datasetLabel: {type: String, required: true},
},{collection : 'uploaded_Data'});

mongoose.model('DataFile', DataFileSchema);

module.exports = mongoose.model('DataFile');