import React from 'react'
import { DataStore } from '@aws-amplify/datastore';
import { Node } from '../models';

export async function getNodes() {
  try {
    const nodes = await DataStore.query(Node);
    return nodes
  } catch (err) {
    console.log(`err`, err);
  }
}

export default getNodes;
