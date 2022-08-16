const { ServiceBusClient } = require("@azure/service-bus");
const config = require('../../config')

async function sendMessage(messages, azureQueueName){
    const sbClient = new ServiceBusClient(config.azureBusConnectionString);
	const sender = sbClient.createSender(azureQueueName);
    try {
	  let batch = await sender.createMessageBatch(); 
	  for (let i = 0; i < messages.length; i++) {
		if (!batch.tryAddMessage(messages[i])) {			
		  await sender.sendMessages(batch);
		  batch = await sender.createMessageBatch();
		  if (!batch.tryAddMessage(messages[i])) {
		    throw new Error("Message too big to fit in a batch");
		  }
		}
	  }
	  // Send the last created batch of messages to the queue
	  await sender.sendMessages(batch);
      // Close the sender
      await sender.close();
    }finally{
      await sbClient.close();
    }
}

module.exports = {
    sendMessage
};