const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// GraphQL Schema
const typeDefs = `
  type Launch {
    id: ID!
    mission_name: String
    launch_date_utc: String
    rocket: Rocket
    details: String
    success: Boolean
    links: LaunchLinks
  }

  type Rocket {
    rocket_id: ID!
    rocket_name: String
    rocket_type: String
  }

  type LaunchLinks {
    mission_patch: String
    article_link: String
  }

  type Query {
    launches: [Launch]
    launch(id: ID!): Launch
  }
`;

const resolvers = {
    Query: {
      launches: async () => {
        const response = await axios.get('https://api.spacexdata.com/v3/launches');
        return response.data.map(launch => ({
          id: launch.flight_number,
          mission_name: launch.mission_name,
          launch_date_utc: launch.launch_date_utc,
          details: launch.details,
          success: launch.launch_success,
          links: {
            mission_patch: launch.links.mission_patch
          },
          rocket: {
            rocket_name: launch.rocket.rocket_name
          }
        }));
      },
      launch: async (_, { id }) => {
        const response = await axios.get(`https://api.spacexdata.com/v3/launches/${id}`);
        return {
          id: response.data.flight_number,
          mission_name: response.data.mission_name,
          launch_date_utc: response.data.launch_date_utc,
          details: response.data.details,
          success: response.data.launch_success,
          links: {
            mission_patch: response.data.links.mission_patch
          },
          rocket: {
            rocket_name: response.data.rocket.rocket_name
          }
        };
      }
    }
  };

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  app.use('/graphql', expressMiddleware(server));
  
  // REST endpoint for latest launch
  app.get('/api/latest-launch', async (req, res) => {
    try {
      const response = await axios.get('https://api.spacexdata.com/v4/launches/latest');
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}

startServer();
