const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");
const addNotification = require("./CreateNotification");
const updateProjectRunStatus = require("./UpdateProjectRunStatus");

// connection string to your Service Bus namespace: Node--> python
const connectionString = "Endpoint=sb://plainxai-channel.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ej+qQy1iN9NAl+KM68W0QvOpyagvwprfTDE4j3SP2g8=";

// name of the queue:
const queueName = "freshrecorderforfrontend";

async function pollProjectCompletion(projectId, projectName) {
  console.log("Polling for project completion with project id: ", projectId);
  // create a Service Bus client using the connection string to the Service Bus namespace
  const sbClient = new ServiceBusClient(connectionString);

  // createReceiver() can also be used to create a receiver for a subscription.
  const receiver = sbClient.createReceiver(queueName);

  // function to handle messages
  const myMessageHandler = async (azureQueueMessage) => {
    console.log(`Received message: ${azureQueueMessage.body}`);
    const userId = azureQueueMessage.body.userId;
    const projectIdFromQueueMessage = azureQueueMessage.body.projectId;
    console.log("Project id from queue message: ", projectIdFromQueueMessage);
    console.log("the user id is: " + userId);
    if (projectId === projectIdFromQueueMessage) {
      console.log("found the project id and message that we are looking for.");
      receiver.completeMessage(azureQueueMessage)
          .then( async() => {
            console.log("Completed message: ", azureQueueMessage.body)
            await receiver.close()
            await sbClient.close()
            // should do the above later on
      
            console.log("Message completed"); 
          })


      console.log(
        `project id: ${projectId} was found in return queue.\n Adding notification......`
      );
       updateProjectRunStatus(projectId)
        .then((project) => {
          const projectName = project.modelName;
          const userId = project.userId;
          const projectId = project._id;
          addNotificationToCollection(userId, projectName, projectId, "createSuccess"); //@todo make projectStatus to ENUM

          console.log("Successfully Updated the project run status" + project);
        })
        .catch((err) => {
          addNotificationToCollection(userId, projectName, projectId, "createFailed");
          console.log("Something went wrong " + err);
        });
    
    }
  };

  // function to handle any errors
  const myErrorHandler = async (error) => {
    console.log(error);
  };

   console.log("started the subscripting to the queue: " + queueName);
  // subscribe and specify the message and error handlers
  receiver.subscribe(
    { processMessage: myMessageHandler, processError: myErrorHandler },
    { autoCompleteMessages: false }
  );

  // Waiting long enough before closing the sender to send messages
  const oneMinute = 60000;
  const fiveMinute = 5 * oneMinute;
  const oneHour = 60 * oneMinute;
  const threeHours = 3 * oneHour; // we are assuming the model runs and everything will last at most 3 hours

  await delay(threeHours);
  await receiver.close();
  await sbClient.close();
}

const addNotificationToCollection = async (userId, projectName, projectId,  updatedProjectStatus) => {
  const notification = {
    userId: userId,
    projectId:projectId,
    message: `Project - ${projectName} is ready now!`,
    type: "alert",
    updatedProjectStatus: updatedProjectStatus
  };
 
 
  addNotification(notification).then((notification) =>
    console.log("Added a notification: ", notification)
  );
  
};


module.exports = pollProjectCompletion;
