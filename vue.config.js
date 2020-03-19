// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#
// 这里只列一部分，具体配置参考文档
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8888, // 端口号
    https: false, // https:{type:Boolean}
    open: true // 配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
  }
}
