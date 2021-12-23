import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type NodeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GapsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Node {
  readonly id: string;
  readonly title?: string;
  readonly description?: string;
  readonly color?: string;
  readonly gaps?: (string | null)[];
  readonly archived?: boolean;
  readonly trashed?: boolean;
  readonly pined?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Node, NodeMetaData>);
  static copyOf(source: Node, mutator: (draft: MutableModel<Node, NodeMetaData>) => MutableModel<Node, NodeMetaData> | void): Node;
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
  readonly collabarator?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Gaps, GapsMetaData>);
  static copyOf(source: Gaps, mutator: (draft: MutableModel<Gaps, GapsMetaData>) => MutableModel<Gaps, GapsMetaData> | void): Gaps;
}