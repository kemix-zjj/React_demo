// const proxy = require('http-proxy-middleware');
// const { createProxyMiddleware: proxy } = require('http-proxy-middleware');

// module.exports = function (app) {
//   app.use(
//     proxy('/api1', {
//       //语句/api1前缀的请求，就会触发代理配置
//       targert: 'http://localhost:5000', //请求转发给谁
//       // 必选项
//       changeOrigin: true, //控制服务器收到的响应头中Host字段的值（Host字段的值是标识本次请求从哪发出的）
//       pathRewrite: { '^/api1': '' }, //重写请求路径（必须）
//     }),
//     proxy('/api2', {
//       targert: 'http://localhost:5001',
//       changeOrigin: true,
//       pathRewrite: { '^/api2': '' },
//     }),
//   );
// };

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api1', {
      //语句/api1前缀的请求，就会触发代理配置
      target: 'http://localhost:5000', //请求转发给谁
      changeOrigin: true, //控制器收到的响应头中的Host字段的值（Host字段的值是标识本次请求从哪发出的）
      pathRewrite: { '^/api1': '' }, //重写请求路径（必选项）
    }),
  );
};
