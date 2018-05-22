# Disable Project Billing

This sample Cloud Function shows how to unlink a project from billing when your spend reaches the budget amount you 
defined in reOptimize.

reOptimize will publish a message wehn a budget reaches a threshold. The function checks if the current spend exceeds the
budget amount (make sure you set a threshold of 100% or more) and that the budget targets a specific project.
If these conditions are met it will unlink the budget's target project from its billing account.

**Important**: Unlinking a project from a billing account means that any billable activity of your in-use services will stop, 
and your application could stop functioning as expected.

## Prerequisites

Setup reOptimize Enrichements and Push API

## Enable Cloud Billing API

You will need to enable Cloud Billing API on the project you created your reOptimize Enrichments service account.

That is, if your service account is `reoptimize@MY_PROJECT_ID.iam.gserviceaccount.com` then go to (replace MY_PROJECT_ID with the actual project ID):

https://console.cloud.google.com/apis/library/cloudbilling.googleapis.com/?project=MY_PROJECT_ID and enable the API .

## Permissions

The Cloud Function will need to make API requests using a service account.

1) Create a new service account with JSON key, **rename the key to `service-account-key.json` and put it in this folder.**

The service account needs to have the following permissions in order for the API call to work:

2) `resourcemanager.projects.deleteBillingAssignment`: on every project that you want it to be able to unlink from billing.
You can also give it this permissions on the organization level and it will be inherited to all projects, 
or on a folder level and it will be inherited to projects under that folder.

3) `billing.resourceAssociations.delete`: on the billing account

Since there is no predefined role with these permissions exclusively, you need to create a [custom role](https://cloud.google.com/iam/docs/creating-custom-roles#top_of_page).

The required permissions for unlinking a project from billing account are documented [here](https://cloud.google.com/billing/docs/how-to/custom-roles#resource_associations) under "Remove project from billing account".

**Important:** reOptimize Enrichments service account and the service account in this section are **different** accounts.
reOptimize shouldn't have the ability to disable your projects billing.

## Deploying

```
$ gcloud config set project MY_PROJECT
$ gcloud beta functions deploy budgetEventDisableProjectBilling --trigger-resource MY_TOPIC --trigger-event google.pubsub.topic.publish
```

* Replace `MY_PROJECT` with the project ID that hosts your topic.
* Replace `MY_TOPIC` with the topic name you defined in reOptimize Push API settings. Do NOT use the full resource name 
of the topic (i.e `projects/MY_PROJECT/topics/MY_TOPIC`)

