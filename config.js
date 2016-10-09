var config = {
  replace: {
    hostUrl: 'http://localhost:8081/',
    searchUrl: 'http://localhost:8080/',
    replacement: 'http://localhost:3000/',
    mediaTypes: [undefined, 'application/javascript', 'application/json', 'text/html', 'text/turtle']
  },
  port: 3000
}

module.exports = config
