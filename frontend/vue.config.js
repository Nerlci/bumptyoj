const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
  devServer: {
    port: 8083, // 开发服务器运行端口
    proxy: {
      "/api": {
        target: "http://10.129.221.208:8899", // 目标接口的域名和端口号
        changeOrigin: true, // 是否改变源地址
        ws: true, // 是否代理websockets
        pathRewrite: {
          "^/api": "", // 重写路径：去掉路径中开头的'/api'
        },
      },
    },
  },
};
