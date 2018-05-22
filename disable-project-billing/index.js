const { google } = require('googleapis');
const path = require('path');

/**
 * Cloud Function to be triggered by Pub/Sub.
 *
 * @param {object} event The Cloud Functions event.
 */
exports.budgetEventDisableProjectBilling = event => {
  const pubsubMessage = event.data;

  const attributes = pubsubMessage.attributes;
  console.log(`Message Attributes: ${JSON.stringify(attributes)}`);

  if (attributes.eventType !== 'ALERT_THRESHOLD_EXCEEDED' || !pubsubMessage.data) {
    // Unknown event type or invalid data, ignore message.
    return Promise.resolve();
  }

  const data = Buffer.from(pubsubMessage.data, 'base64').toString();
  console.log(`Message Data: ${data}`);
  const budgetEvent = JSON.parse(data);

  if (budgetEvent.budgetTargetType !== 'PROJECT_ID' || !budgetEvent.projectId ||
    budgetEvent.costAmount < budgetEvent.budgetAmount) {
    // Budget does not target a project or it did not exceed the budget amount yet,
    // There's nothing to do here
    return Promise.resolve();
  }

  const projectId = budgetEvent.projectId;
  console.log(`Removing billing account for project ${projectId}`);

  // You can add more stuff here like excluding some project IDs that you dont want to disable etc...

  // Auth client for google API
  return google.auth.getClient({
    keyFile: path.join(__dirname, 'service-account-key.json'),
    scopes: 'https://www.googleapis.com/auth/cloud-billing'
  }).then(function (client) {

    // Obtain a new v1 cloudbilling client and passing the auth client
    const cloudbilling = google.cloudbilling({
      version: 'v1',
      auth: client
    });

    // Delete project billing association by updating the project billing info and setting the billing account name to an empty string
    return cloudbilling.projects.updateBillingInfo({
      name: `projects/${projectId}`,
      resource: {
        billingAccountName: ''
      }
    });

  }).then(function (result) {
    console.log(`Result: ${JSON.stringify(result.data)}`);
  }).catch(function (error) {
    console.error(error);
  });

};