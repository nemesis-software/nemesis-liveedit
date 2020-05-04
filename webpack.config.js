const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js'
  ],
  output: {
    path: '/home/petar/workspace/nemesis-archetype-master/src/main/webapp/resources/theme/common/js',
    publicPath: '/',
    filename: 'liveEdit.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.css$/,
     	use: [
            'style-loader',
            'css-loader'
        ]
      },
        {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ]
        },
        {
            test: /\.png$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }
            ]
        },
        {
            test: /\.jpg$/,
            use: [
                {
                    loader: 'file-loader'
                }
            ]
        },
        {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        mimetype: 'application/font-woff'
                    }
                }
            ]
        },
        {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        mimetype: 'application/octet-stream'
                    }
                }
            ]
        },
        {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader: 'file-loader'
                }
            ]
        },
        {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        mimetype: 'image/svg+xml'
                    }
                }
            ]
        }
    ]
  },
  resolve: {
    alias: {
      source: path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
