import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const preventOwnerReassignment = {
  owner: a.string().authorization((allow) => [allow.owner().to(["read"])]),
}

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      ...preventOwnerReassignment,
    })
    .authorization((allow) => [allow.owner()]),
  
  SavedResponse: a
    .model({
      question: a.string().required(),
      answer: a.string().required(),
      fileName: a.string(),
      savedAt: a.datetime().required(),
      tags: a.string().array(),
      ...preventOwnerReassignment,
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

