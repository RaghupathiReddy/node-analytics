const addNotification = require("./CreateNotification");

const notification = {
    "userId": "61fb74afa06b13e267ba49c7",
    "message": "Completed successfull!",
    "type": "alert"
}
addNotification(notification)
        .then( notifications => log.info(notifications))
        .catch( err => console.error(err));