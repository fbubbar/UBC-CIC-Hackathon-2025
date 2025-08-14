import { defineFunction } from '@aws-amplify/backend';

export const exampleFunction = defineFunction({
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
});