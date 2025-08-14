import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { exampleFunction } from './functions/example-function/resource.js';

const backend = defineBackend({
  auth,
  data,
  exampleFunction,
});

// Add IAM permissions for Bedrock access
backend.exampleFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'bedrock:InvokeModel',
      'bedrock:Retrieve'
    ],
    resources: [
      'arn:aws:bedrock:*:*:foundation-model/*',
      'arn:aws:bedrock:us-west-2:*:knowledge-base/BEAQP7IZHR'
    ],
  })
);
