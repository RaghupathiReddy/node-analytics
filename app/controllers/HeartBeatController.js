var express = require('express');
var router = express.Router();
const logProvider = require('../logger/LogProvider');

var log = logProvider.getInstance();


// confirms if middleware is up and running.
router.get('', function (req, res) {
    log.debug('HeartBeat API GET /');
    log.info('HeartBeat was called.');
    res.send('All is well!!');
});

module.exports = router;