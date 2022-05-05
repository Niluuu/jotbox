import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type LabelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NodeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Label {
  readonly id: string;
  readonly title: string;
  readonly collabarator?: string;
  readonly collabarators?: (string | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Label, LabelMetaData>);
  static copyOf(source: Label, mutator: (draft: MutableModel<Label, LabelMetaData>) => MutableModel<Label, LabelMetaData> | void): Label;
}

export declare class Node {
  readonly id: string;
  readonly title?: string;
  readonly description?: string;
  readonly color?: string;
  readonly archived?: boolean;
  readonly trashed?: boolean;
  readonly pined?: boolean;
  readonly collabarator: string;
  readonly collabarators: (string | null)[];
  readonly labels?: (string | null)[];
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