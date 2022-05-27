This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

### Start the Project
1. Start the project `npm start`

### Aws
1. Install aws globally read more (https://docs.amplify.aws/start/getting-started/installation/q/integration/react/) 
2. In terminal `amplify pull --appId d17oh96r8b4gc1 --envName staging` to get backend.

### Admin
1. Ask permission from senior developers 
2. GO to the (https://eu-central-1.admin.amplifyapp.com/admin/login?appId=d17oh96r8b4gc1&backendEnvironmentName=dev&redirectPath=/admin/d17oh96r8b4gc1/dev/home)

### Update Backend 
Note: There have 2 ways to do that:

1. Update the code  and `amplify push`
2. Update from "Admin" and `amplify pull` 
FYI: For more info see amplify documentation!
## For add API
Write `amplify update api` see (https://docs.amplify.aws/start/getting-started/data-model/q/integration/react/)

## Generate Graphql
In the project directory, you can run: `amplify codegen`

## Project features
Editor tools:
1. When u enter `[[` in the editor will give the existing node list  `[[node-titile]]`. After u can click on the node title and opens the node.
2. Create a link with text.
3. Update the link with text by selecting and pressing the link button will update the link.
4. Create numbered lists. Press `1` && space will generate a new list that will automatically count for getting a new line press `Enter`.
5. Create a list without numbers (*). Press `*` && space will generate a new list that will automatically count for getting a new line press `Enter`.
6. Create highlighted words with press `#`.
7. Add the color of Node.
8. Share your node with your friends.
9. Filter nodes by `Labels`.
8. Archive the nodes 