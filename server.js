var contentType = require('content-type')
var http = require('http')
var omit = require('lodash/omit')
var replace = require('string-replace-stream')
var url = require('url')

var config = require('./config')

//This is to avoid duplication of slash when exposedBaseURI has trailing slash
var uriPathOffset = config.replace.exposedBaseURI.endsWith("/")? 1 : 0;

// parse search URL for proxy headers
var backendBaseURI = url.parse(config.replace.backendBaseURI)

http.createServer(function (req, res) {
  var target = (config.hostUrl || config.replace.backendBaseURI) + req.url.slice(uriPathOffset)
  var options = url.parse(target)

  // forward request headers
  options.headers = omit(req.headers, 'host')

  // set proxy headers
  if (config.setProxyHeaders) { 
    options.headers['x-forwarded-proto'] = backendBaseURI.protocol.substring(0, backendBaseURI.protocol.lastIndexOf(":"))

    if (config.useProxyPortHeader) {
      options.headers['x-forwarded-host'] = backendBaseURI.hostname

      if (backendBaseURI.port) {
        options.headers['x-forwarded-port'] = backendBaseURI.port
      }
    } else {
      options.headers['x-forwarded-host'] = backendBaseURI.host
    }
  }

  http.request(options, function (result) {
    var mediaType

    // forward statusCode and statusMessage
    res.statusCode = result.statusCode
    res.statusMessage = result.statusMessage

    if (result.headers['content-type']) {
      mediaType = contentType.parse(result.headers['content-type']).type
    }

    // forward response headers, except content length
    Object.keys(omit(result.headers, 'content-length')).forEach(function (key) {
      res.setHeader(key, result.headers[key])
    })

    // only replace content for the given media types (if configured)
    if (!config.replace.mediaTypes || config.replace.mediaTypes.indexOf(mediaType) !== -1) {
      console.log(target + ' -> replace')
      var exposedBaseURI;
      if (config.replace.exposedBaseURI.indexOf("{request}")) {
          exposedBaseURI = config.replace.exposedBaseURI.replace("{request}",
                req.headers.host);
      } else {
          exposedBaseURI = config.replace.exposedBaseURI;
      }
      result.pipe(replace(config.replace.backendBaseURI, exposedBaseURI)).pipe(res)
    } else {
      console.log(target)
      result.pipe(res)
    }
  }).on('error', function (err) {
    res.statusCode = 500
    res.end(err.message)
  }).end()
}).listen(config.port)
