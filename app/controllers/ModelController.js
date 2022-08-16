const express = require('express');
const ErrorMessage  = require('../messages/errorMessage');
const router = express.Router();
const ExplainabilityLanding = require('../models/ExplainabilityLanding');
const FeatureExplainability = require('../models/FeatureExplainability');
const FeatureRanking = require("../models/FeatureRanking")
const verifyToken = require('./VerifyToken');
const LocalExplainer = require('../models/LocalExplainability')
const LocalExplainerRecords = require('../models/LocalExplainabilityRecords')
const GlobalExplainerGraph = require('../models/GlobalExpainerGraph');
const GlobalShapTableData = require('../models/GlobalShapTableData');


router.get('/global_explainability/:id', verifyToken, function (req, res) {
  requiredColumns = ['categories.category', 'categories.shap', 'categories.records.shap', 'categories.records.isPredicted', 'categories.records.deviationFromMean', 'categories.records.predictedProbability']
  ExplainabilityLanding.findById(req.params.id)
    .populate("modelData", "modelName modelType modelTarget modelClass")
    .select(requiredColumns)
    .exec(async function (err, categories) {
      if (err) {
        res.status(500).send({ message: err });
        return 
      }
      if (!categories){ 
        res.status(404).send({ message: "No Data found" });
        return 
      }
      res.status(200).send(categories);
    });
});

router.get('/local_explainability/:id', verifyToken , function(req,res){
  ExplainabilityLanding.findById(req.params.id).exec(async function (err,data){
    if(err){
      res.status(500).send({message  : err})
      return 
    }
    if(!data){ 
      res.status(400).send({message : 'Data not found'})
      return 
    }
    res.status(200).send(data)
  })
})

// /model/:id
router.get("/:id", function (req, res) {
  requiredColumns = [
    "modelDetail.metricData",
    "modelDetail.metadata",
    "modelDetail.confusionMatrixData",
    "modelDetail.rocGraphData",
  ];
  ExplainabilityLanding.findById(req.params.id)
    .select(requiredColumns)
    .exec(function (err, modelDetail) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!modelDetail) {
        res.status(404).send({ message: ErrorMessage.modelDetailNotFound });
        return;
      }
      res.status(200).send({ modelDetail: modelDetail });
    });
});

// /feature-explainability/:id 

router.get('/feature_explainability/:id', verifyToken,function(req,res) {
  FeatureExplainability.findById((req.params.id), function(err, data) {
    if(err){
      res.status(500).send({message: ErrorMessage.somethingWentWrong});
      return 
    }
    if(!data ) {
      res.status(404).send({message:ErrorMessage.modelDetailNotFound});
      return 
    }
    res.status(200).send({data: data, message: 'Feature Explainability results found succesfully'});
  })
})

//Provides data for chart in localExplainer screen
router.get('/local_explainer/:projectId', verifyToken, function(req,res){
  LocalExplainer.find({$and: [{claimno : req.query.claimNumber},{projectId : req.params.projectId}]}).exec( function (err, data){
    if(err){ 
      res.status(500).send({message : ErrorMessage.somethingWentWrong});
      return 
    }
    if(!data){
      res.status(404).send({message:ErrorMessage.notFound});
      return 
    }
    res.status(200).send(data)
  })
})


//Provides data for records table in localExplainer Screen 
router.get('/local_explainer/records/:projectId', function(req,res){
  const page = req.query.page || 0;
  const perPage = req.query.perPage || 10;
  const offset = page * perPage;
  const sort = req.query.sortColumn || 'id';
  let sortOrder = {};
  if(req.query.order === 'desc') 
    sortOrder[sort] = -1;
  else{
    sortOrder[sort] = 1; 
  }
  let query = buildQuerySet(req.query.filter)
  LocalExplainerRecords.paginate({$and: [{projectId: req.params.projectId}, query]}, {offset: offset, limit: perPage, sort: sortOrder})
    .then(result => {
      if(result.totalDocs === 0)
        res.status(404).send({message:ErrorMessage.notFound});
      else
        res.status(200).send(result)
    })
    .catch(err => res.status(500).send({message : ErrorMessage.somethingWentWrong}));
})

router.get("/global_explainer/:projectId", verifyToken, function(req, res) {
  GlobalExplainerGraph.find({ projectId: req.params.projectId })
    .exec(function (err, globalExplainer) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!globalExplainer) {
        res.status(404).send({ message: ErrorMessage.notFound });
        return;
      }
       FeatureRanking.find({
           projectId: req.params.projectId
         })
         .exec(function(err, featureRanking) {
           if (err) {
             res.status(500).send({
               message: err
             });
             return;
           }
           if (!featureRanking) {
             res.status(404).send({
               message: ErrorMessage.notFound
             });
             return;
           }
           res.status(200).send({
             featureRanking: featureRanking,
             globalExplainer: globalExplainer
           });
         });
    });
});

router.get("/feature-ranking/:projectId", verifyToken,  function (req, res) {
  FeatureRanking.find({ projectId: req.params.projectId })
    .exec(function (err, featureRanking) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!featureRanking) {
        res.status(404).send({ message: ErrorMessage.notFound });
        return;
      }
      res.status(200).send({ featureRanking: featureRanking });
    });
});



router.get("/global-records/:projectId/:start/:end", function(req, res) {
  GlobalShapTableData.find({
      projectId: req.params.projectId,
      probability: {
        $gte: req.params.start,
        $lt: req.params.end,
      }
    })
    .exec(function(err, shapRecords) {
      if (err) {
        res.status(500).send({
          message: err
        });
        return;
      }
      if (!shapRecords) {
        res.status(404).send({
          message: ErrorMessage.notFound
        });
        return;
      }
      res.status(200).send({
        shapRecords: shapRecords
      });
    });
});

const buildQuerySet = (filterSet) => {
  let filterJSON = JSON.parse(filterSet);
  let keys = Object.keys(filterJSON);
  let query = {};
  for(let key in keys){
    let hash = {}
    let querySet = {}
    let operator = filterJSON[keys[key]]['type']
    if(['blank', 'notBlank'].includes(operator)){
      hash[keys[key]] = getOperator(operator)
    }
    else{
      querySet[getOperator(operator)] = filterJSON[keys[key]]['filter']
      hash[keys[key]] = querySet
    }
    query = { ...query, ...hash}
  }
  return query;
}

const getOperator = (operator) => {
  switch(operator) {
    case 'equals':
      return '$eq'
    case 'notEqual':
      return '$ne'
    case 'lessThan':
      return '$lt'
    case 'greaterThan':
      return '$gt'
    case 'lessThanOrEqual':
      return '$lte'
    case 'greaterThanOrEqual':
      return '$gte'
    case 'blank':
      return {'$eq': null}
    case 'notBlank':
      return {'$ne': null}
  }
}
module.exports = router;
