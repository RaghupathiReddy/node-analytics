const message  = require('../../../messages/validatorErrorMessage')
const {isFieldEmpty} = require('../../../utils/helperFunctions')

function validateUserDetails(req, res, next) {
    const {firstName, lastName, email, password, company, designation} = req.body;
    if(isFieldEmpty(firstName)){
        res.status(400).send({message: message.firstNameNotFound});
        return;
    }else if(isFieldEmpty(lastName)){
        res.status(400).send({message: message.lastNameNotFound});
        return;
    }else if(isFieldEmpty(email)){
        res.status(400).send({message: message.emailNotFound});
        return;
    }else if(isFieldEmpty(password)){
        res.status(400).send({message: message.passwordNotFound});
        return;
    }else if(isFieldEmpty(company)){
        res.status(400).send({message: message.companyNameNotFound});
        return;
    }else if(isFieldEmpty(designation)){
        res.status(400).send({message: message.designationNotFound});
        return;
    }
    next();
}

module.exports = validateUserDetails;