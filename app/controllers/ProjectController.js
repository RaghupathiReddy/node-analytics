const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Model = require('../models/Model');
const verifyToken = require('./VerifyToken');
const { sendMessage } = require('../crud/Message');
const ModelComparison = require('../models/ModelComparison');
const ModelSummary = require('../models/ModelSummary');
const BiasResult = require('../models/BiasResult');
const BiasFeature = require('../models/BiasFeature');
const EDAData = require('../models/EDAData')
const pollProjectCompletion = require('./../crud/PollProjectCompletion')
const BinaryTree = require('../models/BusinessTree');
const config = require('../../config');

// Returns all the projects in the database 
router.get('/all/:userId', verifyToken, function (req, res){
    Project.find({$or:[{userId: req.params.userId},{"collaborators.userId" : { $in: [req.params.userId] }}]}).sort({createdOn: 'desc'}).exec(function (err, projects) {
        if (err) 
            return res.status(500).send({message: "There was a problem finding the projects. Please try again after sometime"});
        var response_data = projects.map((project) => {
            return {
              projectId: project.id, 
              projectName: project.modelName,
              projectDescription:project.modelDescription,
              projectCreatedDate: project.createdOn,
              isRunComplete: project.isRunComplete,
              projectType: project.projectType
            };
        });
        res.status(200).send(response_data);
    });
});

// Creates a new project
router.post('/', verifyToken,  async function(req, res){   
    try{
      Project.create(req.body,
        function (err, project) {
          if (err) {
            console.log(err)
            return res.status(400).send({message: 'There was a problem creating the project. Please try again after sometime456'});
          }
          var message={};
          if(project.trainingData){
            message = {
              projectId: project.id,
              modelFile: project.modelFile,
              trainingData: project.trainingData,
              yFile: project.yFile,
              task: 1
            }
          }
          else{
            message = {
              projectId: project.id,
              modelFile: project.dataFile,
            }
          }
          sendMessage([{body: message}], config.azureQueueChannel.plainxCommunication)
          pollProjectCompletion(project.id, project.modelName)
          res.status(200).send({project: project, message: 'Project has been created successfully'});
        }
      );
    }
    catch(err){
      res.status(500).send({message: 'There was a problem creating the project. Please try again after sometime123'});
    }
});

// Gets a single project from the database
router.get('/:id', verifyToken, function (req, res) {
    Project.findById(req.params.id, async function (err, project) {
        if (err) return res.status(500).send({message: "There was a problem finding the project"});
        if (!project) return res.status(404).send({message: "No Project found."});
        const models = await Model.find({projectId: project.id})
        res.status(200).send({projectDetails: project, models: models});
    });
});

// Gets model Run status for single project

router.get("/status/:id", verifyToken, function (req, res) {
  Project.findById(req.params.id, async function (err, project) {
    if (err)
      return res
        .status(500)
        .send({ message: "There was a problem finding the project" });
    const statusRunData = {
      projectId: project.id,
      isRunComplete: project.isRunComplete,
    };

    if (!project) return res.status(404).send({ message: "No Project found." });
    res.status(200).send({ statusRunData: statusRunData });
  });
});
//add colabrators to the project
router.put('/addCollaborator', verifyToken, function (req, res) {
  Project.findOneAndUpdate({ _id: req.body.projectId }, { $set: { collaborators: req.body.collaborators } }, { new: true }, function (err, data) {
    if (err) {
      res.status(500).send({ message: "There was a problem updating the Collaborators for the project." });
      return
    } else if (!data) {
      res.status(404).send({ message: "No Project found." });
      return
    }
    res.status(200).send({ data: data, message: 'Collaborators data updated succesfully' });
    return
  });
})
//  Updates a single project in the database
// router.put('/:id', verifyToken, function (req, res) {
//     updatedProject =  {
//         userId: req.body.userId,
//         project_name: req.body.projectName,
//         project_id: req.body.projectId,
//         project_stage: req.body.projectStage,
//         industry : req.body.industry,
//         use_case: req.body.useCase,
//     };
//     Project.findByIdAndUpdate(req.params.id, updatedProject, {new: true}, function (err, project) {
//         if (err) return res.status(500).send({message: "There was a problem updating the project."});
//         if(!project) return res.status(404).send({message: 'No Project found'});
//         res.status(200).send(project);
//     });
// });

// // Delets a single project from the database
// router.delete('/:id', verifyToken, function (req, res) {
//     Project.findByIdAndRemove(req.params.id, function (err, project) {
//         if (err) return res.status(500).send({message: "There was a problem deleting the project."});
//         if(!project) return res.status(404).send({message: 'No Project found'});
//         res.status(200).send("Project: "+ project.project_name +" was deleted.");
//     });
// });

// /project/model_comparison/:projectId
router.get('/model_comparison/:projectId', verifyToken, function(req, res) {
  ModelComparison.findOne({projectId: req.params.projectId}, function (err, data) {
    if (err) 
      return res.status(500).send({message: "There was a problem finding the data. Please try again after sometime"});
    if(!data) return res.status(404).send({message: "No project found with given id"})
    res.status(200).send({data: data, message: 'Model summary details found succesfully'});
  });
})

router.get('/data_summary/:projectId', verifyToken, function(req, res) {
  ModelSummary.findOne({projectId: req.params.projectId}, function(err, data) {
    if(err)
      return res.status(500).send({message: "There was a problem finding the data. Please try again after sometime"});
    if(!data ) return res.status(404).send({message: "No project found with given id"});
    res.status(200).send({data: data, message: 'Model comparison details found succesfully'});
  })
})

router.get('/bias_results/:projectId', verifyToken, function(req, res) {
  BiasResult.findOne({projectId: req.params.projectId}, function(err, data) {
    if(err)
      return res.status(500).send({message: "There was a problem finding the data. Please try again after sometime"});
    if(!data ) return res.status(404).send({message: "No project found with given id"});
    res.status(200).send({data: data, message: 'Bias results found succesfully'});
  })
})

router.get('/bias_features/:projectId', verifyToken, function(req, res) {
  BiasFeature.findOne({projectId: req.params.projectId}, function(err, data) {
    if(err)
      return res.status(500).send({message: "There was a problem finding the data. Please try again after sometime"});
    if(!data ) return res.status(404).send({message: "No project found with given id"});
    res.status(200).send({data: data, message: 'Bias features found succesfully'});
  })
})

router.get('/eda_data/:projectId', verifyToken, function(req, res) {
  EDAData.findOne({projectId: req.params.projectId}, function(err, data) {
    if(err)
    return res.status(500).send({message: "There was a problem finding the data. Please try again after sometime"});
    if(!data ) return res.status(404).send({message: "No project found with given id"});
    res.status(200).send({data: data, message: 'EDA data found succesfully'});
  })
})

router.get('/business_tree/:projectId', verifyToken,  function(req, res) {
  BinaryTree.findOne({projectId: req.params.projectId}, function(err, data) {
    if(err) 
     res.status(500).send({message: "There was a problem fetching data. Please try again after sometime"});
    if(!data )
     res.status(404).send({message: "No project found with given id"});
    res.status(200).send({data: data, message: 'Binary Tree data found succesfully'});
    return
  })
})

router.put('/business_tree/:projectId', verifyToken, function (req, res) {
  BinaryTree.findOneAndUpdate({projectId: req.params.projectId}, {$set: {treeGraphData : req.body}}, {new: true}, function (err,data) {
      if (err){
        res.status(500).send({message: "There was a problem updating the Business Tree."});}
      if(!data) 
        res.status(404).send({message: 'No data found'});
      res.status(200).send({data: data, message: 'Business Tree data updated succesfully'});
      return
  });
});

module.exports = router
