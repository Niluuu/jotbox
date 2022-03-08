/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateNodeInput = {
  id?: string | null,
  title?: string | null,
  description?: string | null,
  color?: string | null,
  gaps?: Array< string | null > | null,
  archived?: boolean | null,
  trashed?: boolean | null,
  pined?: boolean | null,
  collabarator: string,
  collabarotors: Array< string | null >,
  _version?: number | null,
};

export type ModelNodeConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  color?: ModelStringInput | null,
  gaps?: ModelStringInput | null,
  archived?: ModelBooleanInput | null,
  trashed?: ModelBooleanInput | null,
  pined?: ModelBooleanInput | null,
  collabarator?: ModelStringInput | null,
  collabarotors?: ModelStringInput | null,
  and?: Array< ModelNodeConditionInput | null > | null,
  or?: Array< ModelNodeConditionInput | null > | null,
  not?: ModelNodeConditionInput | null,
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
  color?: string | null,
  gaps?: Array< string | null > | null,
  archived?: boolean | null,
  trashed?: boolean | null,
  pined?: boolean | null,
  collabarator: string,
  collabarotors: Array< string | null >,
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
  color?: string | null,
  gaps?: Array< string | null > | null,
  archived?: boolean | null,
  trashed?: boolean | null,
  pined?: boolean | null,
  collabarator?: string | null,
  collabarotors?: Array< string | null > | null,
  _version?: number | null,
};

export type DeleteNodeInput = {
  id: string,
  _version?: number | null,
};

export type CreateUsersInput = {
  id?: string | null,
  email?: string | null,
  name?: string | null,
  password?: string | null,
  _version?: number | null,
};

export type ModelUsersConditionInput = {
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  password?: ModelStringInput | null,
  and?: Array< ModelUsersConditionInput | null > | null,
  or?: Array< ModelUsersConditionInput | null > | null,
  not?: ModelUsersConditionInput | null,
};

export type Users = {
  __typename: "Users",
  id: string,
  email?: string | null,
  name?: string | null,
  password?: string | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUsersInput = {
  id: string,
  email?: string | null,
  name?: string | null,
  password?: string | null,
  _version?: number | null,
};

export type DeleteUsersInput = {
  id: string,
  _version?: number | null,
};

export type CreateGapsInput = {
  id?: string | null,
  title: string,
  collabarator: string,
  collabarators?: Array< string | null > | null,
  _version?: number | null,
};

export type ModelGapsConditionInput = {
  title?: ModelStringInput | null,
  collabarator?: ModelStringInput | null,
  collabarators?: ModelStringInput | null,
  and?: Array< ModelGapsConditionInput | null > | null,
  or?: Array< ModelGapsConditionInput | null > | null,
  not?: ModelGapsConditionInput | null,
};

export type Gaps = {
  __typename: "Gaps",
  id: string,
  title: string,
  collabarator: string,
  collabarators?: Array< string | null > | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateGapsInput = {
  id: string,
  title?: string | null,
  collabarator?: string | null,
  collabarators?: Array< string | null > | null,
  _version?: number | null,
};

export type DeleteGapsInput = {
  id: string,
  _version?: number | null,
};

export type ModelNodeFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  color?: ModelStringInput | null,
  gaps?: ModelStringInput | null,
  archived?: ModelBooleanInput | null,
  trashed?: ModelBooleanInput | null,
  pined?: ModelBooleanInput | null,
  collabarator?: ModelStringInput | null,
  collabarotors?: ModelStringInput | null,
  and?: Array< ModelNodeFilterInput | null > | null,
  or?: Array< ModelNodeFilterInput | null > | null,
  not?: ModelNodeFilterInput | null,
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

export type ModelNodeConnection = {
  __typename: "ModelNodeConnection",
  items:  Array<Node | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelUsersFilterInput = {
  id?: ModelIDInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  password?: ModelStringInput | null,
  and?: Array< ModelUsersFilterInput | null > | null,
  or?: Array< ModelUsersFilterInput | null > | null,
  not?: ModelUsersFilterInput | null,
};

export type ModelUsersConnection = {
  __typename: "ModelUsersConnection",
  items:  Array<Users | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelGapsFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  collabarator?: ModelStringInput | null,
  collabarators?: ModelStringInput | null,
  and?: Array< ModelGapsFilterInput | null > | null,
  or?: Array< ModelGapsFilterInput | null > | null,
  not?: ModelGapsFilterInput | null,
};

export type ModelGapsConnection = {
  __typename: "ModelGapsConnection",
  items:  Array<Gaps | null >,
  nextToken?: string | null,
  startedAt?: number | null,
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
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
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
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
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
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUsersMutationVariables = {
  input: CreateUsersInput,
  condition?: ModelUsersConditionInput | null,
};

export type CreateUsersMutation = {
  createUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUsersMutationVariables = {
  input: UpdateUsersInput,
  condition?: ModelUsersConditionInput | null,
};

export type UpdateUsersMutation = {
  updateUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUsersMutationVariables = {
  input: DeleteUsersInput,
  condition?: ModelUsersConditionInput | null,
};

export type DeleteUsersMutation = {
  deleteUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
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
    collabarator: string,
    collabarators?: Array< string | null > | null,
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
    collabarator: string,
    collabarators?: Array< string | null > | null,
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
    collabarator: string,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
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
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
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
      color?: string | null,
      gaps?: Array< string | null > | null,
      archived?: boolean | null,
      trashed?: boolean | null,
      pined?: boolean | null,
      collabarator: string,
      collabarotors: Array< string | null >,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
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
      color?: string | null,
      gaps?: Array< string | null > | null,
      archived?: boolean | null,
      trashed?: boolean | null,
      pined?: boolean | null,
      collabarator: string,
      collabarotors: Array< string | null >,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetUsersQueryVariables = {
  id: string,
};

export type GetUsersQuery = {
  getUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserssQueryVariables = {
  filter?: ModelUsersFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserssQuery = {
  listUserss?:  {
    __typename: "ModelUsersConnection",
    items:  Array< {
      __typename: "Users",
      id: string,
      email?: string | null,
      name?: string | null,
      password?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncUsersQueryVariables = {
  filter?: ModelUsersFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUsersQuery = {
  syncUsers?:  {
    __typename: "ModelUsersConnection",
    items:  Array< {
      __typename: "Users",
      id: string,
      email?: string | null,
      name?: string | null,
      password?: string | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
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
    collabarator: string,
    collabarators?: Array< string | null > | null,
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
      collabarator: string,
      collabarators?: Array< string | null > | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
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
      collabarator: string,
      collabarators?: Array< string | null > | null,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateNodeSubscription = {
  onCreateNode?:  {
    __typename: "Node",
    id: string,
    title?: string | null,
    description?: string | null,
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
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
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
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
    color?: string | null,
    gaps?: Array< string | null > | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarotors: Array< string | null >,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUsersSubscription = {
  onCreateUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUsersSubscription = {
  onUpdateUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUsersSubscription = {
  onDeleteUsers?:  {
    __typename: "Users",
    id: string,
    email?: string | null,
    name?: string | null,
    password?: string | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGapsSubscription = {
  onCreateGaps?:  {
    __typename: "Gaps",
    id: string,
    title: string,
    collabarator: string,
    collabarators?: Array< string | null > | null,
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
    collabarator: string,
    collabarators?: Array< string | null > | null,
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
    collabarator: string,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
