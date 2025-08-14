import { defineStorage } from '@aws-amplify/backend'
import { aws_s3 as s3 } from 'aws-cdk-lib'

export const storage = defineStorage({
  name: 'onetdata'
})