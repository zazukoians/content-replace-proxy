var config = {
  replace: {
    searchUrl: 'http://data.admin.ch/',
    replacement: 'http://{request}/',
    mediaTypes: [undefined, 'application/javascript', 'application/json', 'text/html', 'text/turtle']
  },
  port: 3000,
  hostUrl: 'http://data.admin.ch/',
  setProxyHeaders: true,
  useProxyPortHeader: true
}

module.exports = config
