var config = {
  replace: {
    searchUrl: 'http://localhost:8080/',
    replacement: 'http://localhost:3000/',
    mediaTypes: [undefined, 'application/javascript', 'application/json', 'text/html', 'text/turtle']
  },
  port: 3000,
  hostUrl: 'http://localhost:8081/',
  setProxyHeaders: true,
  useProxyPortHeader: true
}

module.exports = config
