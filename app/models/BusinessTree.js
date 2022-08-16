var mongoose = require('mongoose');  

const filterSchema = new mongoose.Schema({
  filterName:{type:String},
  isCategoricalData:{type:Boolean},
  filterValues:{type:Array}
  })

const treeGraphDataAttributes=new mongoose.Schema({
  name:{type:String},
  isSelected:{type:Boolean},
  filterKey:{type:String},
  filterCondition:{type:String},
  filterCriteria:{type:String},
  })

const nodeDisplayDataSchema=new mongoose.Schema({
  bias:{type:String},
  probability:{type:Number},
})

var binaryNodeSchema=new mongoose.Schema({
})
//this has been done to have the recursive type for children
binaryNodeSchema.add({
  name:{type:String},
    attributes:{type:treeGraphDataAttributes},
    nodeDisplayData:{type:nodeDisplayDataSchema},
    children:{type:[binaryNodeSchema]}
})

var BinaryTreeSchema = new mongoose.Schema({
    projectId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Project"},
    filter:{type:[filterSchema]},
    treeGraphData:{type:[binaryNodeSchema]}
},{collection : 'binary_Tree'});

mongoose.model('BusinessTree', BinaryTreeSchema);

module.exports = mongoose.model('BusinessTree');