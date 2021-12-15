/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGapsInput = {
  id?: string | null,
  title: string,
  _version?: number | null,
};

export type ModelGapsConditionInput = {
  title?: ModelStringInput | null,
  and?: Array< ModelGapsConditionInput | null > | null,
  or?: Array< ModelGapsConditionInput | null > | null,
  not?: ModelGapsConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Gaps = {
  __typename: "Gaps",
  id: string,
  title: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateGapsInput = {
  id: string,
  title?: string | null,
  _version?: number | null,
};

export type DeleteGapsInput = {
  id: string,
  _version?: number | null,
};

export type CreateNodeInput = {
  id?: string | null,
  title?: string | null,
  description?: string | null,
  gaps?: Array< string | null > | null,
  pined: boolean,
  archived: boolean,
  _version?: number | null,
};

export type ModelNodeConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  gaps?: ModelIDInput | null,
  pined?: ModelBooleanInput | null,
  archived?: ModelBooleanInput | null,
  and?: Array< ModelNodeConditionInput | null > | null,
  or?: Array< ModelNodeConditionInput | null > | null,
  not?: ModelNodeConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Node = {
  __typename: "Node",
  id: string,
  title?: string | null,
  description?: string | null,
  gaps?: Array< string | null > | null,
  pined: boolean,
  archived: boolean,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateNodeInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  gaps?: Array< string | null > | null,
  pined?: boolean | null,
  archived?: boolean | null,
  _version?: number | null,
};

export type DeleteNodeInput = {
  id: string,
  _version?: number | null,
};

export type ModelGapsFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelGapsFilterInput | null > | null,
  or?: Array< ModelGapsFilterInput | null > | null,
  not?: ModelGapsFilterInput | null,
};

export type ModelGapsConnection = {
  __typename: "ModelGapsConnection",
  items:  Array<Gaps >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelNodeFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  gaps?: ModelIDInput | null,
  pined?: ModelBooleanInput | null,
  archived?: ModelBooleanInput | null,
  and?: Array< ModelNodeFilterInput | null > | null,
  or?: Array< ModelNodeFilterInput | null > | null,
  not?: ModelNodeFilterInput | null,
};

export type ModelNodeConnection = {
  __typename: "ModelNodeConnection",
  items:  Array<Node >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type CreateGapsMutationVariables = {
  input: CreateGapsInput,
  condition?: ModelGapsConditionInput | null,
};

export type CreateGapsMutation = {
  createGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGapsMutationVariables = {
  input: UpdateGapsInput,
  condition?: ModelGapsConditionInput | null,
};

export type UpdateGapsMutation = {
  updateGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGapsMutationVariables = {
  input: DeleteGapsInput,
  condition?: ModelGapsConditionInput | null,
};

export type DeleteGapsMutation = {
  deleteGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateNodeMutationVariables = {
  input: CreateNodeInput,
  condition?: ModelNodeConditionInput | null,
};

export type CreateNodeMutation = {
  createNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateNodeMutationVariables = {
  input: UpdateNodeInput,
  condition?: ModelNodeConditionInput | null,
};

export type UpdateNodeMutation = {
  updateNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteNodeMutationVariables = {
  input: DeleteNodeInput,
  condition?: ModelNodeConditionInput | null,
};

export type DeleteNodeMutation = {
  deleteNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetGapsQueryVariables = {
  id: string,
};

export type GetGapsQuery = {
  getGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGapssQueryVariables = {
  filter?: ModelGapsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGapssQuery = {
  listGapss?:  {
    __typename: "ModelGapsConnection",
    items:  Array< {
      __typename: "Gaps",
      id: string,
      title: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncGapsQueryVariables = {
  filter?: ModelGapsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncGapsQuery = {
  syncGaps?:  {
    __typename: "ModelGapsConnection",
    items:  Array< {
      __typename: "Gaps",
      id: string,
      title: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetNodeQueryVariables = {
  id: string,
};

export type GetNodeQuery = {
  getNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListNodesQueryVariables = {
  filter?: ModelNodeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNodesQuery = {
  listNodes?:  {
    __typename: "ModelNodeConnection",
    items:  Array< {
      __typename: "Node",
      id: string,
      title?: string | null,
      description?: string | null,
      gaps?: Array< string | null > | null,
      pined: boolean,
      archived: boolean,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncNodesQueryVariables = {
  filter?: ModelNodeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncNodesQuery = {
  syncNodes?:  {
    __typename: "ModelNodeConnection",
    items:  Array< {
      __typename: "Node",
      id: string,
      title?: string | null,
      description?: string | null,
      gaps?: Array< string | null > | null,
      pined: boolean,
      archived: boolean,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateGapsSubscription = {
  onCreateGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGapsSubscription = {
  onUpdateGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGapsSubscription = {
  onDeleteGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNodeSubscription = {
  onCreateNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNodeSubscription = {
  onUpdateNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNodeSubscription = {
  onDeleteNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    gaps?: Array< string | null > | null,
    pined: boolean,
    archived: boolean,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
