import * as awsServerlessExpress from 'aws-serverless-express';
import { compiler } from './index';
import { createApp } from '@graffiticode/graffiticode-compiler-framework';

const app = createApp(compiler);
const server = awsServerlessExpress.createServer(app);

export function handler(event, context) {
  awsServerlessExpress.proxy(server, event, context);
}
