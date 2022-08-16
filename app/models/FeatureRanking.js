var mongoose = require('mongoose');  

var FeatureRankingSchema = new mongoose.Schema({
    projectId:{ type: String, required: true, ref: "Project"},
    values: { type: Array, required: true},
   
},{collection : 'feature_Ranking'});

mongoose.model('FeatureRanking', FeatureRankingSchema);

module.exports = mongoose.model('FeatureRanking');

