/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNode = /* GraphQL */ `
  mutation CreateNode(
    $input: CreateNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    createNode(input: $input, condition: $condition) {
      id
      title
      pined
      trashed
      collaborators
      color
      gaps
      description
      archived
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateNode = /* GraphQL */ `
  mutation UpdateNode(
    $input: UpdateNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    updateNode(input: $input, condition: $condition) {
      id
      title
      pined
      trashed
      collaborators
      color
      gaps
      description
      archived
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteNode = /* GraphQL */ `
  mutation DeleteNode(
    $input: DeleteNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    deleteNode(input: $input, condition: $condition) {
      id
      title
      pined
      trashed
      collaborators
      color
      gaps
      description
      archived
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createUsers = /* GraphQL */ `
  mutation CreateUsers(
    $input: CreateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    createUsers(input: $input, condition: $condition) {
      id
      email
      name
      password
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers(
    $input: UpdateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    updateUsers(input: $input, condition: $condition) {
      id
      email
      name
      password
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteUsers = /* GraphQL */ `
  mutation DeleteUsers(
    $input: DeleteUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    deleteUsers(input: $input, condition: $condition) {
      id
      email
      name
      password
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createGaps = /* GraphQL */ `
  mutation CreateGaps(
    $input: CreateGapsInput!
    $condition: ModelGapsConditionInput
  ) {
    createGaps(input: $input, condition: $condition) {
      id
      title
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateGaps = /* GraphQL */ `
  mutation UpdateGaps(
    $input: UpdateGapsInput!
    $condition: ModelGapsConditionInput
  ) {
    updateGaps(input: $input, condition: $condition) {
      id
      title
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteGaps = /* GraphQL */ `
  mutation DeleteGaps(
    $input: DeleteGapsInput!
    $condition: ModelGapsConditionInput
  ) {
    deleteGaps(input: $input, condition: $condition) {
      id
      title
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
