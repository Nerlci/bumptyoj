module.exports = {
    devServer: {
        port: 8083, // 开发服务器运行端口
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // 目标接口的域名和端口号
                changeOrigin: true, // 是否改变源地址
                ws: true, // 是否代理websockets
                pathRewrite: {
                    '^/api': '' // 重写路径：去掉路径中开头的'/api'
                }
            }
        }
    }
};
