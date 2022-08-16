var mongoose = require('mongoose');  

var ModelComparisonSchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    neuralNetwork: { type: Object},
    logisticRegression: { type: Object},
    svm: { type: Object},
    randomForest: { type: Object},
    xgBoost: { type: Object},
    ensembleModel: { type: Object},
},{collection : 'model_Comparison'});

mongoose.model('ModelComparison', ModelComparisonSchema);

module.exports = mongoose.model('ModelComparison');