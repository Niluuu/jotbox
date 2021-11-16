import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type NodeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Node {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly gaps?: (string | null)[];
  readonly pined: boolean;
  readonly archived: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Node, NodeMetaData>);
  static copyOf(source: Node, mutator: (draft: MutableModel<Node, NodeMetaData>) => MutableModel<Node, NodeMetaData> | void): Node;
}