/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateLabelInput = {
  id?: string | null,
  title: string,
  collabarator?: string | null,
  collabarators?: Array< string | null > | null,
  _version?: number | null,
};

export type ModelLabelConditionInput = {
  title?: ModelStringInput | null,
  collabarator?: ModelStringInput | null,
  collabarators?: ModelStringInput | null,
  and?: Array< ModelLabelConditionInput | null > | null,
  or?: Array< ModelLabelConditionInput | null > | null,
  not?: ModelLabelConditionInput | null,
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

export type Label = {
  __typename: "Label",
  id: string,
  title: string,
  collabarator?: string | null,
  collabarators?: Array< string | null > | null,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateLabelInput = {
  id: string,
  title?: string | null,
  collabarator?: string | null,
  collabarators?: Array< string | null > | null,
  _version?: number | null,
};

export type DeleteLabelInput = {
  id: string,
  _version?: number | null,
};

export type CreateNodeInput = {
  id?: string | null,
  title?: string | null,
  description?: string | null,
  color?: string | null,
  archived?: boolean | null,
  trashed?: boolean | null,
  pined?: boolean | null,
  collabarator: string,
  collabarators: Array< string | null >,
  labels?: Array< string | null > | null,
  img?: Array< string | null > | null,
  todo?: string | null,
  _version?: number | null,
};

export type ModelNodeConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  color?: ModelStringInput | null,
  archived?: ModelBooleanInput | null,
  trashed?: ModelBooleanInput | null,
  pined?: ModelBooleanInput | null,
  collabarator?: ModelStringInput | null,
  collabarators?: ModelStringInput | null,
  labels?: ModelStringInput | null,
  img?: ModelStringInput | null,
  todo?: ModelStringInput | null,
  and?: Array< ModelNodeConditionInput | null > | null,
  or?: Array< ModelNodeConditionInput | null > | null,
  not?: ModelNodeConditionInput | null,
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
  archived?: boolean | null,
  trashed?: boolean | null,
  pined?: boolean | null,
  collabarator: string,
  collabarators: Array< string | null >,
  labels?: Array< string | null > | null,
  img?: Array< string | null > | null,
  todo?: string | null,
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
  archived?: boolean | null,
  trashed?: boolean | null,
  pined?: boolean | null,
  collabarator?: string | null,
  collabarators?: Array< string | null > | null,
  labels?: Array< string | null > | null,
  img?: Array< string | null > | null,
  todo?: string | null,
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

export type ModelLabelFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  collabarator?: ModelStringInput | null,
  collabarators?: ModelStringInput | null,
  and?: Array< ModelLabelFilterInput | null > | null,
  or?: Array< ModelLabelFilterInput | null > | null,
  not?: ModelLabelFilterInput | null,
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

export type ModelLabelConnection = {
  __typename: "ModelLabelConnection",
  items:  Array<Label | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelNodeFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  color?: ModelStringInput | null,
  archived?: ModelBooleanInput | null,
  trashed?: ModelBooleanInput | null,
  pined?: ModelBooleanInput | null,
  collabarator?: ModelStringInput | null,
  collabarators?: ModelStringInput | null,
  labels?: ModelStringInput | null,
  img?: ModelStringInput | null,
  todo?: ModelStringInput | null,
  and?: Array< ModelNodeFilterInput | null > | null,
  or?: Array< ModelNodeFilterInput | null > | null,
  not?: ModelNodeFilterInput | null,
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

export type CreateLabelMutationVariables = {
  input: CreateLabelInput,
  condition?: ModelLabelConditionInput | null,
};

export type CreateLabelMutation = {
  createLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLabelMutationVariables = {
  input: UpdateLabelInput,
  condition?: ModelLabelConditionInput | null,
};

export type UpdateLabelMutation = {
  updateLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLabelMutationVariables = {
  input: DeleteLabelInput,
  condition?: ModelLabelConditionInput | null,
};

export type DeleteLabelMutation = {
  deleteLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
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
    color?: string | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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

export type GetLabelQueryVariables = {
  id: string,
};

export type GetLabelQuery = {
  getLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListLabelsQueryVariables = {
  filter?: ModelLabelFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLabelsQuery = {
  listLabels?:  {
    __typename: "ModelLabelConnection",
    items:  Array< {
      __typename: "Label",
      id: string,
      title: string,
      collabarator?: string | null,
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

export type SyncLabelsQueryVariables = {
  filter?: ModelLabelFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncLabelsQuery = {
  syncLabels?:  {
    __typename: "ModelLabelConnection",
    items:  Array< {
      __typename: "Label",
      id: string,
      title: string,
      collabarator?: string | null,
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
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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
      archived?: boolean | null,
      trashed?: boolean | null,
      pined?: boolean | null,
      collabarator: string,
      collabarators: Array< string | null >,
      labels?: Array< string | null > | null,
      img?: Array< string | null > | null,
      todo?: string | null,
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
      archived?: boolean | null,
      trashed?: boolean | null,
      pined?: boolean | null,
      collabarator: string,
      collabarators: Array< string | null >,
      labels?: Array< string | null > | null,
      img?: Array< string | null > | null,
      todo?: string | null,
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

export type OnCreateLabelSubscription = {
  onCreateLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLabelSubscription = {
  onUpdateLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLabelSubscription = {
  onDeleteLabel?:  {
    __typename: "Label",
    id: string,
    title: string,
    collabarator?: string | null,
    collabarators?: Array< string | null > | null,
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
    color?: string | null,
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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
    archived?: boolean | null,
    trashed?: boolean | null,
    pined?: boolean | null,
    collabarator: string,
    collabarators: Array< string | null >,
    labels?: Array< string | null > | null,
    img?: Array< string | null > | null,
    todo?: string | null,
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
