# content-replace-proxy
Proxy with content replacement

This is an HTTP proxy that not only rewrites the request but also replaces URIs 
in the HTTP response body to expose the URI-namespace served by the proxy.

The motivating use-case for this proxy is to allow a [Trifid-LD](https://github.com/zazukoians/trifid-ld)
to be accessible on a host that doesn't match the authority section of the URIs
in the graph exposed by Trifid-LD.

For example is you have Trifid-LD exposing a dataset with IRIs in the `https://example.org/`
namespace but want to have them accessible on `localhost` you could use 
`content-replace-proxy` with the following configuration (assuming the Trifid-LD
instances listens to port 8080):

```
var config = {
  replace: {
    backendBaseURI: 'https://example.org/',
    exposedBaseURI: 'http://localhost:3000/',
    mediaTypes: [undefined, 'application/javascript', 'application/json', 'text/html', 'text/turtle']
  },
  port: 3000,
  hostUrl: 'http://localhost:8080/'
}

module.exports = config
```

## Building

    docker build -t crproxy .

## Running

With a `config.js` file in the current working directory you can start it as follows:

    docker run --rm -v `pwd`/config.js:/usr/src/app/config.js crproxy

## Per-built version

A pre-built version is available on the Docker Hub Repositories as 
`zazukoians/content-replace-proxy`. It is recommended to use this image as 
base image for custom configurations.
