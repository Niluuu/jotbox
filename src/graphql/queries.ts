/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLabel = /* GraphQL */ `
  query GetLabel($id: ID!) {
    getLabel(id: $id) {
      id
      title
      collabarator
      collabarators
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listLabels = /* GraphQL */ `
  query ListLabels(
    $filter: ModelLabelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLabels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        collabarator
        collabarators
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
export const syncLabels = /* GraphQL */ `
  query SyncLabels(
    $filter: ModelLabelFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLabels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        collabarator
        collabarators
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
export const getNode = /* GraphQL */ `
  query GetNode($id: ID!) {
    getNode(id: $id) {
      id
      title
      description
      color
      archived
      trashed
      pined
      collabarator
      collabarators
      labels
      img
      todo
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
        description
        color
        archived
        trashed
        pined
        collabarator
        collabarators
        labels
        img
        todo
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
        description
        color
        archived
        trashed
        pined
        collabarator
        collabarators
        labels
        img
        todo
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
