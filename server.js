var contentType = require('content-type')
var http = require('http')
var omit = require('lodash/omit')
var replace = require('string-replace-stream')
var url = require('url')

var config = require('./config')

// parse replacement because we only process the path for the request
var replacementUrl = url.parse(config.replace.replacement)

// parse search URL for proxy headers
var searchUrl = url.parse(config.replace.searchUrl)

http.createServer(function (req, res) {
  var target = (config.hostUrl || config.replace.searchUrl) + req.url.slice(replacementUrl.path.length)
  var options = url.parse(target)

  // forward request headers
  options.headers = omit(req.headers, 'host')

  // set proxy headers
  if (config.setProxyHeaders) {
    options.headers['x-forwarded-proto'] = searchUrl.protocol

    if (config.useProxyPortHeader) {
      options.headers['x-forwarded-host'] = searchUrl.hostname

      if (searchUrl.port) {
        options.headers['x-forwarded-port'] = searchUrl.port
      }
    } else {
      options.headers['x-forwarded-host'] = searchUrl.host
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
      result.pipe(replace(config.replace.searchUrl, config.replace.replacement)).pipe(res)
    } else {
      console.log(target)
      result.pipe(res)
    }
  }).on('error', function (err) {
    res.statusCode = 500
    res.end(err.message)
  }).end()
}).listen(config.port)
