const express = require('express');
const router = express.Router();
const BusinessTopic = require('../models/BusinessTopic');
const ExplainabilityLanding = require('../models/ExplainabilityLanding');
const verifyToken = require('./VerifyToken');

router.get('/get_all_topics', verifyToken, function (req, res) {
  BusinessTopic.find({}, function (err, topics) {
    if (err) 
      return res.status(500).send("There was a problem finding the users.");
    var filtered_topics = topics.map((topic) => {
      return {business_id: topic.business_id, title: topic.topic, description: topic.subtopic, children: topic.children}
    })
    res.status(200).send(filtered_topics);
  });
});

module.exports = router;
