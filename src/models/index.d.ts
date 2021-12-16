import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GapsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NodeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Users {
  readonly id: string;
  readonly email?: string;
  readonly name?: string;
  readonly password?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}

export declare class Gaps {
  readonly id: string;
  readonly title: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Gaps, GapsMetaData>);
  static copyOf(source: Gaps, mutator: (draft: MutableModel<Gaps, GapsMetaData>) => MutableModel<Gaps, GapsMetaData> | void): Gaps;
}

export declare class Node {
  readonly id: string;
  readonly title?: string;
  readonly description?: string;
  readonly gaps?: (string | null)[];
  readonly pined: boolean;
  readonly archived: boolean;
  readonly trashed?: boolean;
  readonly collaborators?: string;
  readonly reminderTime?: string;
  readonly reminderInterval?: string;
  readonly images?: (string | null)[];
  readonly color?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Node, NodeMetaData>);
  static copyOf(source: Node, mutator: (draft: MutableModel<Node, NodeMetaData>) => MutableModel<Node, NodeMetaData> | void): Node;
}