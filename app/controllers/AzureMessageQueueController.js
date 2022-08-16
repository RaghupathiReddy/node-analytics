const express = require('express');
const config = require('../../config');
const { sendMessage } = require('../crud/Message');
const router = express.Router();
const verifyToken = require('./VerifyToken');
const LocalExplainabilityRuntimeRecord = require('../models/LocalExplainabilityRuntimeRecord')
const Project = require('../models/Project');
const {isFieldEmpty} = require('../utils/helperFunctions')
const validatePredictMessage = require('./validators/azureMessageValidators/validatePredictMessage')
// sends a message to azure queue and triggers python script 
router.post('/', verifyToken,validatePredictMessage, function (req, res) {
  const { projectId, messageId, predictions } = req.body;
  var recordInput;
  Project.findById(req.body.projectId, function (err, project) {
    if (err)
      return res.status(500).send({ message: "There was a problem finding the data. Please try again after sometime" });
    if (!project) return res.status(404).send({ message: "No project found with given id" })

    recordInput = {
      predictionId: messageId,
      messageId:messageId,
      projectId: projectId,
      predictions: predictions,
      trainingDataFile: project.trainingData,
      modelFile: project.modelFile,
      yFile: project.yFile
    }
    if (isFieldEmpty(project.trainingData) || isFieldEmpty(project.modelFile)) {
      res.status(403).send({ message: "Project does not contain the required details to complete the operation" })
      return;
    } else {
      sendMessage([{ body: recordInput }], config.azureQueueChannel.localpredictionToPython).catch((err) => {
        res.status(403).send({ message:"Failed to add message to Queue. " + err })
        return
      })

      LocalExplainabilityRuntimeRecord.create(recordInput, function (err, record) {
        if (err) {
          res.status(400).send({ message: err });
          return;
        }
        res.status(200).send({ record: record });
        return;
      });
    }
  });
})

module.exports = router;