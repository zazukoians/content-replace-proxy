var config = {
  replace: {
    searchUrl: 'http://data.staatsarchiv-bs.ch/',
    replacement: 'http://localhost:3000/',
    mediaTypes: [undefined, 'application/javascript', 'application/json', 'text/html', 'text/turtle']
  },
  port: 3000
}

module.exports = config
