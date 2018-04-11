import { graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser-graphql';
import typeis from 'type-is';
import schema from '../data/schema';

const graphql = compose(
  (req, res, next) => {
    // req.is() for graphql body-parser
    req.is = type => typeis(req, [type]);
    next();
  },
  bodyParser.graphql(),
  graphqlExpress({ schema })
);

export const get = graphql;
export const post = graphql;

function compose(...middleware) {
  return middleware.reduce((memo, fn) => {
    return (req, res, next) => {
      if (!memo) return fn(req, res, next);

      memo(req, res, err => {
        if (err) return next(error);
        fn(req, res, next);
      });
    };
  });
}
