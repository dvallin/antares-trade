const publicPath = '/antares-trade'

export default {
  /**
   * Function that mutates the original webpack config.
   * Supports asynchronous changes when a promise is returned (or it's an async function).
   *
   * @param {object} config - original webpack config.
   * @param {object} env - options passed to the CLI.
   * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
   * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
   **/
  webpack(config, _env, _helpers, _options) {
    config.output.publicPath = `${publicPath}/`
    if (config.devServer) {
      config.devServer = {
        historyApiFallback: {
          index: publicPath,
        },
        publicPath,
      }
    }
  },
}
