const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

let hash = {}
hash[`claim no`] = { type: Number} //Testing hacks for space separated column names
var localExplainerRecordsSchema = new mongoose.Schema({
    ...hash,
    projectId: { type: String }, //To be changed later
    probability: { type: Number }
},
{ collection: 'local_Explainability_Records' }
);

localExplainerRecordsSchema.plugin(mongoosePaginate);

mongoose.model('LocalExplainerRecords', localExplainerRecordsSchema)

module.exports= mongoose.model('LocalExplainerRecords')