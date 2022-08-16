const mongoose = require('mongoose');  

const RecordSchema = new mongoose.Schema({
  recordId: {type: mongoose.Schema.Types.ObjectId, required: true},
  isPredicted: { type: Boolean },
  shap: { type: Number },
  deviationFromMean: { type: Number},
  predictedProbability: { type: Number },
})

const CategorySchema = new mongoose.Schema({
  category: { type: String },
  shap: { type: Number},
  records: { type: [RecordSchema]}
})

const explainabilityLandingSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "DataFile" },
  modelData: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Model" },
  runId: {type: String},
  model: {type: String},
  categories: {type: [CategorySchema]},
  defaultData : {type : Object}
},{collection : 'explainability_Landing'});


mongoose.model('ExplainabilityLanding', explainabilityLandingSchema);
module.exports = mongoose.model('ExplainabilityLanding');