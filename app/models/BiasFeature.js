var mongoose = require('mongoose');  

var BiasFeatureSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    featureBiasDataList: { type: Object, required: true},
    biasToFeatureMapList: { type: Object, required: true},
    biasInfoList: { type: Object, required: true} 
},{collection : 'bias_Feature'});

mongoose.model('BiasFeature', BiasFeatureSchema);

module.exports = mongoose.model('BiasFeature');