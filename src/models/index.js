// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Node } = initSchema(schema);

export {
  Node
};