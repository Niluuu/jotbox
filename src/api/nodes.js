import React from 'react'
import { API } from 'aws-amplify';
import { listNodes } from '../graphql/queries';

export async function getNodes() {
  try {
    const nodes = await API.graphql({ listNodes });
    return nodes
  } catch (err) {
    console.log(`err`, err);
  }
}

export default getNodes;
