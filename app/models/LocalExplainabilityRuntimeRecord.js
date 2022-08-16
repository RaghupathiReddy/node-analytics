const mongoose = require('mongoose')

var LocalExplainabilityRuntimeRecordSchema = new mongoose.Schema({
    predictionId: { type: String },
    messageId: { type: String },
    projectId: { type: String },
    predictions: {type:Object},
    trainingDataFile: {type:String},
    modelFile: {type:String},
},
{ collection: 'local_Explainability_RuntimeRecords' }
);

mongoose.model('LocalExplainabilityRuntimeRecord', LocalExplainabilityRuntimeRecordSchema)

module.exports= mongoose.model('LocalExplainabilityRuntimeRecord')