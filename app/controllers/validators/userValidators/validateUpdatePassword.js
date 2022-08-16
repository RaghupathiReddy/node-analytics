const messages  = require('../../../messages/validatorErrorMessage')
const {isFieldEmpty} = require('../../../utils/helperFunctions')

function validateUpdatePassword(req, res, next) {
    const new_password = req.body.password;
    if(isFieldEmpty(new_password)){
        res.status(400).send({message: messages.passwordNotFound});
        return;
    }
    next();
}

module.exports = validateUpdatePassword;