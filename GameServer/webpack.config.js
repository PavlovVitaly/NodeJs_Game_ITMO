path = require('path');
webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './Frontend/client.js',
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'bundle.js',
    },
    target: 'web',
    // externals: [nodeExternals()],

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })],

    module:{
        rules:[
            {
                "test": [ /\.vert$/, /\.frag$/ ],
                "use": 'raw-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader"
            }
        ]
    }
};