const { removeWebpackPlugin, appendWebpackPlugin } = require('@rescripts/utilities')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = (config) => {
  config = removeWebpackPlugin('ESLintWebpackPlugin', config)
  config = appendWebpackPlugin(
    new FaviconsWebpackPlugin({
      // Your source logo (required)
      logo: `${__dirname}/../../public/resources/logo.svg`,
      // Enable caching and optionally specify the path to store cached data
      // Note: disabling caching may increase build times considerably
      cache: true,
      // Override the publicPath option usually read from webpack configuration
      // publicPath: './build/assets',
      // The directory to output the assets relative to the webpack output dir.
      // Relative string paths are allowed here ie '../public/static'. If this
      // option is not set, `prefix` is used.
      // outputPath: 'resources',
      // Prefix path for generated assets
      // prefix: '',
      // Inject html links/metadata (requires html-webpack-plugin).
      inject: true,
      favicons: {
        appName: 'Velas Safe',
        appShortName: 'Velas Safe',
        appDescription: 'Velas Safe is the most trusted platform to manage digital assets',
        // Primary language for name and short_name
        lang: 'en-US',
        // mode: 'webapp',
        // set of URLs that the browser considers within your app
        scope: '/',
        version: 'v3.30',
        preferRelatedApplications: false, // Should the browser prompt the user to install the native companion app. `boolean`
        background: '#ddd',
        theme_color: '#002D74',
        // Maskable source image(s) for manifest.json. "true" to use default source. More information at https://web.dev/maskable-icon/. `boolean`, `string`, `buffer` or array of `string`
        manifestMaskable: 'true',
        display: 'standalone',
        orientation: 'any',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          favicons: true,
          windows: true,
          coast: false,
          yandex: false,
        },
      },
    }),
    config,
  )
  return config
}
