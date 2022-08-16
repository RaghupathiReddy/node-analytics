var mongoose = require('mongoose');  

const treemapSchema = new mongoose.Schema({
  category: { type: String },
  features: { type: Number },
  rank: { type: Number},
})

const featureExplainabilityData =new mongoose.Schema({
  rank: { type: Number},
  feature: { type: String},
  averageShap: { type: Number},
  totalPositive: { type: Number},
  totalNegative: { type: Number},
  occurance: { type: Number},
  percentagePresentEntries: { type: Number},
  category: { type: String},
})
      
var FeatureExplainabilitySchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    featureExplainabilityTreemap: { type: [treemapSchema]},
    featureExplainabilityTable: { type: [featureExplainabilityData]},
},{collection : 'feature_Explainability'});

mongoose.model('FeatureExplainability', FeatureExplainabilitySchema);

module.exports = mongoose.model('FeatureExplainability');