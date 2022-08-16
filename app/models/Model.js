var mongoose = require('mongoose');  

var ModelSchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    modelName: { type: String, required: true},
    modelType: { type: String, required: true},
    modelFile: { type: String, required: true},
    modelClass: { type: String},
    modelTarget: { type: String},
    internalExternalFlag: {type: String, required: true},
},{collection : 'model_Details'});

mongoose.model('Model', ModelSchema);

module.exports = mongoose.model('Model');