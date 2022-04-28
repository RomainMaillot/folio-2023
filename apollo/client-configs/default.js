import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import schema from './schema.json' // <= contain schema of my graphql api
const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: schema
  })

export default ({req, app}) => {
    return {
        httpEndpoint: process.env.HTTPENDPOINT,
        cache: new InMemoryCache({ fragmentMatcher }),
        // httpLinkOptions: {
        //     credentials: "include"
        // },
    }
}
