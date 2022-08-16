
const Notification = require('../models/Notification');

const addNotification = async (notification) => {
    const dateCreated = new Date();

    return Notification.create({
        userId: notification.userId,
        message: notification.message,
        projectId: notification.projectId,
        type: notification.type,
        isRead: false,
        dateCreated: dateCreated
    }) 
    .then(function(notification){
        return notification;
    })
};

module.exports = addNotification;