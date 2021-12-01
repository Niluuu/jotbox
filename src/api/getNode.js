import { DataStore } from '@aws-amplify/datastore';


// TODO Check why dost return the cart 
export const  getNodes = async () => {
    try {
      const todos = await DataStore.query(Node);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      return todos
    } catch (err) {
      console.log(`err`, err);
    }
  }

