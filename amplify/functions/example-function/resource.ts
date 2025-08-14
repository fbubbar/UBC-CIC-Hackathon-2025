import { defineFunction } from '@aws-amplify/backend';

export const exampleFunction = defineFunction({
  name: 'example-function',
  entry: './handler.py',
  runtime: 'python3.11',
  timeoutSeconds: 30,
  memoryMB: 512,
});