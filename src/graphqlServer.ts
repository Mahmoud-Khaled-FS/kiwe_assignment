import { readFileSync } from 'node:fs';
import { Router } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { join } from 'node:path';
import { weatherResolvers } from './features/weather/routes/graphql';

export async function setupGraphQLServer(app: Router) {
  const typeDefs = `
    ${readFileSync(join(__dirname, 'schema.graphql'), 'utf-8')}
  `;

  const resolversFeatures: any[] = [weatherResolvers];
  const resolvers: any = {};

  for (const r of resolversFeatures) {
    resolvers.Query = {
      ...r.Query,
    };
  }

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  // @ts-ignore
  app.use('/graphql', expressMiddleware(server));
}
