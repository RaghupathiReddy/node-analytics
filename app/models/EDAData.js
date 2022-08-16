var mongoose = require('mongoose');  

var EDADataSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    columnAndLineChart: { type: Object, required: true},
    stackedBarChart: { type: Object, required: true},
    areaChart: { type: Object, required: true}, 
    heatMap: { type: Object, required: true}, 
},{collection : 'EDA_Data'});

mongoose.model('EDAData', EDADataSchema);

module.exports = mongoose.model('EDAData');