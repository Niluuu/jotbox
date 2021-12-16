// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Users, Gaps, Node } = initSchema(schema);

export {
  Users,
  Gaps,
  Node
};