/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNode = /* GraphQL */ `
  query GetNode($id: ID!) {
    getNode(id: $id) {
      id
      title
      pined
      trashed
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
export const listNodes = /* GraphQL */ `
  query ListNodes(
    $filter: ModelNodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        pined
        trashed
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
      nextToken
      startedAt
    }
  }
`;
export const syncNodes = /* GraphQL */ `
  query SyncNodes(
    $filter: ModelNodeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncNodes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        pined
        trashed
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
      nextToken
      startedAt
    }
  }
`;
export const getUsers = /* GraphQL */ `
  query GetUsers($id: ID!) {
    getUsers(id: $id) {
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
export const listUserss = /* GraphQL */ `
  query ListUserss(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getGaps = /* GraphQL */ `
  query GetGaps($id: ID!) {
    getGaps(id: $id) {
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
export const listGapss = /* GraphQL */ `
  query ListGapss(
    $filter: ModelGapsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGapss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncGaps = /* GraphQL */ `
  query SyncGaps(
    $filter: ModelGapsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncGaps(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
