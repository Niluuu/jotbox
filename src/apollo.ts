import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

export const apollo = new ApolloClient({
  // You can try other endpoints, such as GitHub. In that case, you'll need
  // to get an access token from https://github.com/settings/tokens/new .
  //
  //    uri: 'https://api.github.com/graphql',
  //    headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` },
  //
  // **Please note that including access tokens in your client code is
  // just for testing. If you push it in public, your token will be abused.**

  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  }),
});
