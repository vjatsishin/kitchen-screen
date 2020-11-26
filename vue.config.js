module.exports = {
    publicPath: '',
    devServer: {
        inline: true,
        // host: '192.168.0.21',
        port: 8080
    },
    configureWebpack: {
        performance: { hints: false },
        output: {
            filename: "[hash].[name].js",
            chunkFilename: "js/[chunkhash].[name].module.js"
        }
    },
    productionSourceMap: false,
    pwa: {
        name: 'Kitchen Screen',
        themeColor: '#4c9cba',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black'
    }
}