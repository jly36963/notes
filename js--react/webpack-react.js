// ------------
// webpack
// ------------

// docs
  // https://webpack.js.org/concepts/

// ------------
// usage
// ------------

// file name -- webpack.config.js
// webpack file should be in root

// package.json scripts
`
{
  "scripts": {
    "build": "webpack --watch",
  }
}
`

// ------------
// entry & output
// ------------

// entry and output must be specified
  // entry -- where does the dependency graph begin
  // output -- where to emit bundles

// import
const path = require('path');

// entry
const inputPath = "./src/index.js";
// output -- './public/bundle.js'
const outputPath = path.join(__dirname, 'public');
const outputFile = 'main.js';

// config
module.exports = {
  entry: inputPath, // path of module to use as entry point
  output: {
    path: outputPath, // where to emit bundles
    filename: outputFile // main output file
  }
}

// multiple entry points can be specified
  // example -- '{ entry: { main: './src/app.js', vendor: './src/vendor.js' } }'

// ------------
// loaders
// ------------

// loaders -- transformations that are applied to the source code of a module
  // must be installed (ie: `npm i --save css-loader`)

// webpack only understands js and json
// loaders allow webpack to process other types of files and convert them into modules
  // import a CSS file
  // convert TypeScript to Javascript

// rules
  // test -- identifies which file(s) should be transformed
  // use -- which loader should be used to do the transforming

// multiple loaders
  // right to left, bottom to top
  // order in this example: sass, css, then style loader

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }, // txt
      { test: /\.ts$/, use: 'ts-loader' }, // ts
      { test: /\.css$/, 
        use: [
          // style
          { loader: 'style-loader' },
          // css
          { 
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // sass
          { loader: 'sass-loader'}
        ] 
      },
    ]
  }
}

// ------------
// plugins
// ------------

// plugins perform tasks 
  // ie: bundle optimization, asset management, injection of env variables
  // any other build tasks that a loader can't do

// html-webpack-plugin
  // genertaes an HTML file for the app by automatically injecting the generated bundles.


const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  // ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ]
}


// ------------
// mode
// ------------

// mode
  // enable webpack's built-in optimizations for a specified environment

module.exports = {
  mode: 'production' // development, production, none (default: production)
};

// ------------
// create react app
// ------------

// CRA webpack.config.js
  // https://github.com/facebook/create-react-app/blob/e89f153224cabd67efb0175103244e0b7f702767/packages/react-scripts/config/webpack.config.js

// example
  // the below version has been reduced/simplified greatly
  // order of loaders/plugins was not preserved (too complicated lol)

// imports
const path = require('path');
const fs = require('fs');
// plugins
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// path resolve methods
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );
  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.js`);
};
// paths
const paths = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
}

module.exports = {
  // ...
  entry: '',
  output: {
    path: '',
    filename: ''
  },
  loaders: [
    {
      loader: require.resolve('style-loader'),
    },
    {
      loader: require.resolve('css-loader'),
      // ...
    },
    {
      loader: require.resolve('postcss-loader'),
      // ...
    },
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      loader: require.resolve('eslint-loader'),
      // ... 
    },
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: paths.appSrc,
      loader: require.resolve('babel-loader'),
      options: {
        customize: require.resolve('babel-preset-react-app/webpack-overrides'),
      }
    },
    // process any js outside of the app with babel
    {
      test: /\.(js|mjs)$/,
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      loader: require.resolve('babel-loader'),
      // ...
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        // ...
      },
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
    },
    {
      loader: require.resolve('resolve-url-loader'),
      // ...
    },
  ],
  plugins: [
    // plug n play, faster installs, guards against forgotten dependencies
    PnpWebpackPlugin,
    // prevents use of modules above ./src/
    new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    // related to plug n play
    PnpWebpackPlugin.moduleLoader(module),
    // html webpack plugin (generate index.html)
    new HtmlWebpackPlugin( /* ... */ ),
    // inlines the webpack runtime script
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    // make env variables available in index.html
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // gives info around missing modules
    new ModuleNotFoundPlugin(paths.appPath),
    // hot updates
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    // experimental hot loading
    isEnvDevelopment && shouldUseReactRefresh 
      && new ReactRefreshWebpackPlugin({ /* ... */ }),
    // prevent mistype casing (in a path)
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    // don't require restart if npm install after require missing module
    isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // generate service worker script that will precache assets & keep updated
    new WorkboxWebpackPlugin.GenerateSW({ /* ... */ }),
    // typescript type checking
    useTypeScript &&
      new ForkTsCheckerWebpackPlugin(/* ... */),

  ]
}

// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------



// ------------
//
// ------------

