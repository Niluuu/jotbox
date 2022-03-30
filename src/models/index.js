// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Label, Node, Users } = initSchema(schema);

export {
  Label,
  Node,
  Users
};