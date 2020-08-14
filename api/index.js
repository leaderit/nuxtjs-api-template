// API Server side Init file
import { json } from 'body-parser'
const url = require('url');

export default [
    { path: "/api", handler: json() },
    {
      path: "/api",
      handler: (req, res, next) => {
        const url = require("url");
        req.query = url.parse(req.url, true).query;
        req.params = { ...req.query, ...req.body };
        next();
      }
    },
    // Set API context for handler
    // Put all need variables and functions in the context    
    {
      path: '/api',
      async handler (req, res, next) {
        let url = req._parsedUrl.pathname.replace(/^\/+|\/+$|\.+/g, "");
        url = url.split("/");
        let method = url.pop();
        let controller = url.slice(1).join("/");
        let api = require("./" + controller);
        let token = null
        let tokenType = ''
        if ( req.headers.authorization ) {
            const auth = req.headers.authorization.split(' ')
            token = auth[1].trim()
            tokenType = auth[0].trim()
        }
        let context = {
          req,
          res,
          token,
          tokenType
        }
        // Bind context for API handler and call API method        
        const apiMethod = api[method].bind( context )
        let result = await apiMethod(req.params );
        res.end(JSON.stringify(result));
      }
    },
]
