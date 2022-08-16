const mongoose = require('mongoose');  

const BusinessTopicSchema = new mongoose.Schema({
  businessId: {type: Number},
  topic: {type: String},
  subtopic: {type: String},
  children: {type: Array}
},{collection : 'business_Topics'});

mongoose.model('BusinessTopic', BusinessTopicSchema);

module.exports = mongoose.model('BusinessTopic');