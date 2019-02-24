const is_test =
  process.env.NODE_ENV === 'test' || process.env.BABEL_ENV === 'test';

module.exports = {
  plugins: [is_test && '@babel/plugin-transform-modules-commonjs'].filter(
    Boolean
  )
};
