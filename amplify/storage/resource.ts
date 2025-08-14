import { defineStorage } from '@aws-amplify/backend'
import { aws_s3 as s3 } from 'aws-cdk-lib'

export const storage = defineStorage({
  name: 'onetdata',
  access: (allow) => ({
    read: allow.public(),
    write: allow.authenticated()
  }),
  customCdkProps: {
    blockPublicAccess: new s3.BlockPublicAccess({
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false
    }),
    cors: [
      {
        allowedMethods: [
          s3.HttpMethods.GET,
          s3.HttpMethods.PUT,
          s3.HttpMethods.POST,
          s3.HttpMethods.DELETE,
          s3.HttpMethods.HEAD
        ],
        allowedOrigins: ['*'],
        allowedHeaders: ['*']
      }
    ]
  }
})