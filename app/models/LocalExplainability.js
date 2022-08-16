const mongoose = require('mongoose');

var localExplainerSchema = new mongoose.Schema({
		claimno: { type: Number },
		projectId: { type: String } //To be changed later
	},
	{ collection: 'local_Explainability' }
);

mongoose.model('LocalExplainer', localExplainerSchema);

module.exports = mongoose.model('LocalExplainer');
