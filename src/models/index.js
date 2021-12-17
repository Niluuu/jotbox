// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Node, Users, Gaps } = initSchema(schema);

export {
  Node,
  Users,
  Gaps
};