const { isFieldEmpty, isFieldObject } = require('../../../utils/helperFunctions')
const messages = require('../../../messages/validatorErrorMessage')

function validatePredictMessage(req, res, next) {
    const { projectId, messageId, predictions } = req.body;
    if (isFieldEmpty(projectId)) {
        res.status(400).send({ message: messages.projectIdNotFound });
        return;
    } else if (isFieldEmpty(messageId)) {
        res.status(400).send({ message: messages.messageIdNotFound });
        return;
    } else if (!isFieldObject(predictions)) {
        res.status(400).send({ message: messages.predictionsNotFound });
        return;
    }
    next();
}

module.exports = validatePredictMessage;