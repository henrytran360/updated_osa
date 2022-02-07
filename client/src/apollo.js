// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { setContext } from "@apollo/link-context";

// Need firebase for token authentication
import firebase from "firebase/app";
import "firebase/auth";

// Wraps our requests with a token if one exists
// Copied from: https://www.apollographql.com/docs/react/v3.0-beta/networking/authentication/
const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from firebase if it exists
    const token = await firebase.auth().currentUser.getIdToken();
    // return the headers to the context so httpLink can read them
    console.log(token);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// HTTP Backend Link
const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
    // uri: "http://localhost:3000/graphql",
    // uri: "/graphql",
});

// WebSocket Backend Link
// const wsLink = new WebSocketLink({
//     // uri: `ws://localhost:3000/graphql`,
//     uri: process.env.REACT_APP_GRAPHQL_WS_URL,
//     options: {
//         reconnect: true
//     }
// });

// Uses wsLink for subscriptions, httpLink for queries & mutations (everything else)
// const splitLink = split(
//     ({ query }) => {
//         const definition = getMainDefinition(query);
//         return (
//             definition.kind === 'OperationDefinition' &&
//             definition.operation === 'subscription'
//         );
//     },
//     wsLink,
//     httpLink,
// );

// Setup cache
const cache = new InMemoryCache();

// Initialize Client
export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

// Initial local state
const initialState = {
    service: process.env.REACT_APP_SERVICE_URL,
    recentUpdate: false,
    term: 202220,
    degreeplanparent: "",
};

// Initialize cache with a state
client.writeQuery({
    query: gql`
        query InitialState {
            service
            recentUpdate
            term
            degreeplanparent
        }
    `,
    data: initialState,
});
