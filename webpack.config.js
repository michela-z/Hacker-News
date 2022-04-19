const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/JS/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                entry: './src/CSS/style.css',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hacker News',
            filename: 'index.html',
            template: 'src/template.html',
        })
    ]
};
