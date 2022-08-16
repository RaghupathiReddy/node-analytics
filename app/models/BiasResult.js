var mongoose = require('mongoose');  

var BiasResultSchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    claim: { type: Array, required: true},
    bias: { type: Array, required: true},
    graphEnabled: { type: Array, required: true},
    claimAndBiasDetails: { type: Object, required: true},
},{collection : 'bias_Result'});

mongoose.model('BiasResult', BiasResultSchema);

module.exports = mongoose.model('BiasResult');