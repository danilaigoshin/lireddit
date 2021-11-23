import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieSession from 'cookie-session';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import MikroORMConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { __prod__, port } from './constants';
import { MyContext } from './types';

const main = async () => {
  const orm = await MikroORM.init(MikroORMConfig);
  await orm.getMigrator().up();

  const app = express();
  const RedisStore = connectRedis(session);

  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  });

  app.set('trust proxy', true);
  app.use(
    cookieSession({
      signed: false,
      secure: false,
    })
  );

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: 'qowiueojwojfalksdjoqiwueo',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port, () => console.log('server started on localhost:4000'));
};

main();
