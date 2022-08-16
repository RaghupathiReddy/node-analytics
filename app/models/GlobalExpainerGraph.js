const mongoose = require("mongoose");

var GlobalExplainerGraphSchema = new mongoose.Schema(
  {
    projectId:{ type: String,required:true },
    claimno:{ type: Number,required:true },
    probability:{ type: Number,required:true },
    predicted_fraud:{ type: Number,required:true },
    actual:{ type: Number,required:true },

  },
  { collection: "global_Explainability" }
);


mongoose.model("GlobalExplainerGraph", GlobalExplainerGraphSchema);

module.exports = mongoose.model("GlobalExplainerGraph");