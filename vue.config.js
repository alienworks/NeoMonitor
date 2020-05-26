module.exports = {
  configureWebpack: {
    // other webpack options to merge in ...
  },
  // devServer option don't belong into `configureWebpack`
  devServer: {
    port: 4200,
    disableHostCheck: true,
    proxy: {
      // proxy all requests starting with /api to jsonplaceholder
      '/api': {
        // target: 'http://localhost:5000',
        target: 'http://172.16.50.193:5000',
        changeOrigin: true,
        ws: true
      }
    },
  }
};
