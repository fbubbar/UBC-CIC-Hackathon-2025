import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { exampleFunction } from './functions/example-function/resource.js';

defineBackend({
  auth,
  data,
  exampleFunction,
});
