const messages  = require('../../../messages/validatorErrorMessage')
const {isFieldEmpty} = require('../../../utils/helperFunctions')

function validateResetPassword(req, res, next) {
    const {email, resetPasswordEndPoint} = req.body;
    if(isFieldEmpty(email)){
        res.status(400).send({message: messages.emailNotFound});
        return;
    }else if(isFieldEmpty(resetPasswordEndPoint)){
        res.status(400).send({message: messages.resetPasswordEndPointNotFound});
        return;
    }
    next();
}

module.exports = validateResetPassword;