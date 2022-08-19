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
  readonly collabarator?: string | null;
  readonly collabarators?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Label, LabelMetaData>);
  static copyOf(source: Label, mutator: (draft: MutableModel<Label, LabelMetaData>) => MutableModel<Label, LabelMetaData> | void): Label;
}

export declare class Node {
  readonly id: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly color?: string | null;
  readonly archived?: boolean | null;
  readonly trashed?: boolean | null;
  readonly pined?: boolean | null;
  readonly collabarator: string;
  readonly collabarators: (string | null)[];
  readonly labels?: (string | null)[] | null;
  readonly img?: (string | null)[] | null;
  readonly todo?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Node, NodeMetaData>);
  static copyOf(source: Node, mutator: (draft: MutableModel<Node, NodeMetaData>) => MutableModel<Node, NodeMetaData> | void): Node;
}

export declare class Users {
  readonly id: string;
  readonly email?: string | null;
  readonly name?: string | null;
  readonly password?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}