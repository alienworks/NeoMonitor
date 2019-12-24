module.exports = {
  configureWebpack: {
    // other webpack options to merge in ...
  },
  // devServer option don't belong into `configureWebpack`
  devServer: {
    port: 4200,
    disableHostCheck: true
  }
};
