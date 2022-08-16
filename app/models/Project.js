var mongoose = require('mongoose');  

var collaborators  = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId}
})
var projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
  modelName: {type: String, required: true},
  modelDescription: {type: String, required: true},
  dataFile: { type: String},
  columns: { type: Array},
  yFileColumns: { type: Array},
  primaryKey: { type: String},
  dependentVariable: { type: String},
  trainingData: {type: String},
  yFile: {type: String},
  modelFile: {type: String},
  projectType:{type: String},
  collaborators:{type:[collaborators]},
  createdOn: { type: Date, default: Date.now},
  isRunComplete: { type: Boolean, default: false, required: true},
},{collection : 'project_Details'});


mongoose.model('Project', projectSchema);

module.exports = mongoose.model('Project');