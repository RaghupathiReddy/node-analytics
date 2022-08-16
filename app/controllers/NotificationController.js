const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const addNotification = require("./../crud/CreateNotification");
const verifyToken = require("./VerifyToken");
// Returns all the notifications of a user in the database.
router.get("/all/:userId", verifyToken, function (req, res) {
  Notification.find({ userId: req.params.userId })
    .sort({ dateCreated: "desc" })
    .exec(function (err, notifications) {
      if (err)
        return res
          .status(500)
          .send({
            message:
              "There was a problem finding the notifications. Please try again after some time",
          });
      var response_data = notifications.map((notification) => {
        return {
          notificationId: notification.id,
          message: notification.message,
          dateCreated: notification.dateCreated,
          type: notification.type,
          projectId: notification.projectId,
          isRead: notification.isRead,
          userId: notification.userId,
          updatedProjectStatus: notification.updatedProjectStatus,
        };
      });
      res.status(200).send(response_data);
    });
});

// Returns all the notifications of a user in the database post a specific timestamp
// router.get("/all/:userId/:timeStamp", function (req, res) {
router.get("/check/:userId", verifyToken, function (req, res) {
  let currentTime = new Date().getTime();
  let ONE_HOUR = 60 * 60 * 1000;
  let filterTime = currentTime - ONE_HOUR;
  Notification.find({
    $and: [
      { userId: req.params.userId },
      { dateCreated: { $gt: filterTime  } },
      { isRead: false }
    ],
  })
    .sort({ dateCreated: "desc" })
    .exec(function (err, notifications) {
      if (err)
        return res
          .status(500)
          .send({
            message:
              "There was a problem finding the notifications. Please try again after some time",
          });
      var response_data = notifications.map((notification) => {
        return {
          notificationId: notification.id,
          message: notification.message,
          dateCreated: notification.dateCreated,
          type: notification.type,
          projectId: notification.projectId,
          isRead: notification.isRead,
          userId: notification.userId,
        };
      });
      res.status(200).send(response_data);
    });
});

// Create a notification for user
router.post("/:userId", function (req, res) {
  const notification = {
    userId: req.params.userId,
    message: req.body.message,
    type: req.body.type,
    projectId: req.body.projectId,
    projectName: req.body.projectName,
    updatedProjectStatus: req.body.updatedProjectStatus
  };
  addNotification(notification)
    .then(function (notification) {
      const newlyCreatedNotification = getFormatedNotification(notification);
      res.status(200).send(newlyCreatedNotification);
    })
    .catch(function (err) {
      console.log("Error in creating notification", err);
      res
        .status(500)
        .send({
          message:
            "There was a problem adding the notification. Please try again after some time",
        });
    });
});

// Updates a notification's isRead to true
router.put("/:notificationId", function (req, res) {
  Notification.findByIdAndUpdate(
    req.params.notificationId,
    { $set: { isRead: true } },
    { new: true },
    function (err, notification) {
      if (err)
        return res
          .status(500)
          .send({
            message:
              "There was a problem updating the notification. Please try again after some time",
          });

      const updatedNotification = getFormatedNotification(notification);
      res.status(200).send({
        message: "Notification updated successfully",
        notification: updatedNotification,
      });
    }
  );
});

const getFormatedNotification = (notification) => {
  const newlyCreatedNotification = {
    id: notification.id,
    message: notification.message,
    dateCreated: notification.dateCreated,
    type: notification.type,
    isRead: notification.isRead,
    userId: notification.userId,
  };
  return newlyCreatedNotification;
};

module.exports = router;
