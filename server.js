var contentType = require('content-type')
var http = require('http')
var omit = require('lodash/omit')
var replace = require('string-replace-stream')
var url = require('url')

var config = require('./config')

// parse replacement because we only process the path for the request
config.replace.replacementUrl = url.parse(config.replace.replacement)

http.createServer(function (req, res) {
  var target = (config.replace.hostUrl || config.replace.searchUrl) + req.url.slice(config.replace.replacementUrl.path.length)
  var options = url.parse(target)

  // forward request headers
  options.headers = omit(req.headers, 'host')

  http.request(options, function (result) {
    var mediaType

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
  }).end()
}).listen(config.port)