# reOptimize Push API Examples
Sample actions triggered by reOptimize Push API

## Requirements

The following are required for every example in this repository:

### Setup "Enrichments"

Follow this [guide](https://support.reoptimize.io/hc/en-us/sections/360002865320-Setup) to set up Enrichments.

Enrichments allows reOptimize to access additional information in your organization. Currently enrichments allows
reOptimize to list projects and folders under your organization to enhance the Reports feature. 

The service account you specify will also be used to publish messages to a Pub/Sub topic for the Push API. Therefore,
setting up Enrichments is a pre-requisite to the Push API.

### Setup "Push API"

Follow this [guide](https://reoptimize.zendesk.com/hc/en-us/articles/360002533731-Push-API) to set up Push API.

Push API allows reOptimize to publish messages to a Pub/Sub topic of your choice when certain events occure.
For example, we can publish a message whenever a budget you configured reaches a thredhold.
The examples in this project demonstrate how you can take action upon receiving such messages.
