/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const createNode = /* GraphQL */ `
  mutation CreateNode(
    $input: CreateNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    createNode(input: $input, condition: $condition) {
      id
      title
      description
      gaps
      pined
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
      description
      gaps
      pined
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
      description
      gaps
      pined
      archived
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
