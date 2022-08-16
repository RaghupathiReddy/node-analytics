var mongoose = require('mongoose');  

var ModelSummarySchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    modelTarget: { type: String, required: true},
    documentCount: { type: Number, required: true},
    rateInfo: { type: Object, required: true},
    errorsInfo: { type: Array, required: true},
},{collection : 'model_Summary'});

mongoose.model('ModelSummary', ModelSummarySchema);

module.exports = mongoose.model('ModelSummary');