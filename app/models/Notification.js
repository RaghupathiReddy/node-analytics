var mongoose = require('mongoose');  

var notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
  isRead: { type: mongoose.Schema.Types.Boolean, required: true},
  type : {type: String, required : true},
  projectId: { type: String},
  message: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  updatedProjectStatus: { type: String, required: false}
},{collection : 'notifications'});


mongoose.model('Notification', notificationSchema);

module.exports = mongoose.model('Notification');