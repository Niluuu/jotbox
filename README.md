This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Launch the project

### Main Project

1. Create .env file copying .env.example `cp .env.example .env` and attach graphql endpoint to `REACT_APP_GRAPHQL_ENDPOINT` env varaible

2. Run codegen with `npm run codegen:watch` to generate graphql code from the endpoint.
   Start the react scripts on another tab with `npm start`

Note: You can run `npm run dev` to run both `codgen:watch` & `npm start` concurrently but the debugging experience is note ideal running both scripts.

### Aws

1. Install aws globally read more (https://docs.amplify.aws/start/getting-started/installation/q/integration/react/) 

2. In terminal `amplify pull --appId d17oh96r8b4gc1 --envName staging` to get backend.

Note: You can run `npm run dev` to run both `codgen:watch` & `npm start` concurrently but the debugging experience is note ideal running both scripts.

### Launch Storybooks

1. Do 1st step for Main Project

2. Run codegen with `npm run codegen:watch` to generate graphql code from the endpoint.
   Start the storybooks on another tab with `npm run storybook`

Note: You can run `npm run storybook:dev` to run both `codgen:watch` & `storybook` concurrently but the debugging experience is note ideal running both scripts.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode with `react-scripts start`.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run dev`

Runs the app in the development mode with concurrent scripts `codegen:watch` and `start`.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run codegen`

Runs graphql generator once.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run codegen:watch`

Runs graphql generator and watches for changes.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

It will regenerate graphql code for hooks if you make edits to `*.graphql` files.<br />
You will also see any errors in the console.

### `npm run storybook`

Runs storybooks.<br />
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run storybook:dev`

Runs `storybook` and `codegen` concurrently.<br />
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## For add api

Write `amplify update api` see (https://docs.amplify.aws/start/getting-started/data-model/q/integration/react/)
