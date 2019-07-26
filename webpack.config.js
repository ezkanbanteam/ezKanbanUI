const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack');

module.exports = {
    devServer: {
        inline:true,
        // host: '140.124.181.110',
        // port: 8080,
        port: 3000,
        historyApiFallback: true
    },
    entry: {
      app: './src/index.js'

    },
    
    output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: [
                {
                    loader: 'babel-loader',
                    options: {
                    presets: ['react']
                    }
                }
                ],
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: './src/index.html'
        })
    ]
}
