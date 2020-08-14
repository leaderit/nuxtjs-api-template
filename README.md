# nuxtjs-api-template
Template for creating simple API in NuxtJS without any external servers 

# Set up your project from scratch

To get started, create an empty directory with the name of your project.
Replace <project-name> with the name of your project. Then navigate into it:

    mkdir <project-name>
    cd <project-name>

Then create a file named package.json from terminal:

    touch package.json

Open the package.json file in your favorite code editor and fill it with this JSON content:

    {
        "name": "my-app",
        "scripts": {
            "dev": "nuxt",
            "build": "nuxt build",
            "generate": "nuxt generate",
            "start": "nuxt start"
        }
    }

# Install nuxt    

    npm install nuxt

This command will add nuxt as a dependency to your project and it will add it to your package.json automatically. The node_modules directory will also be created which is where all your installed packages and their dependencies are stored.




# Start the project

Run your project by typing one of the following commands below in your terminal:

    npm run dev

The application is now running on http://localhost:3000.

Open it in your browser by clicking the link in your terminal and you should see the text "Hello World" we copied in the previous step.

# Create  API route

Create an empty directory with the name __api__, and create the __index.js__ file:

    mkdir api
    cd api
    touch index.js

Install packages **body-parser** and **url** into project

    npm install body-parser url

Edit api/index.js file and put API code wraper into:
```
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
    // Controllers and Methods handler. GET - without parameters, POST - with parameters
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

            // Set API context for handler
            // Put all need variables and functions in the context
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
```
Then create test API controller. Create file api/test.js and write test method:
```
// Test api entry
let i = 0

async function index() {
    i = i +1
    console.log( { i } )
    return ( { status: 'ok', i } )        
}

export {
    index
}
```

Then create or update file **nuxt.config.js** with this additionals:
```
import serverMiddleware from './api'

export default {
    serverMiddleware
}
```

# Test API entry

Open api entry url in browser:

    http://localhost:3000/api/test/index

You wil get JSON answer:

    {"status":"ok","i":1}

Every update will increment i by 1. On server console you will see diagnostic message:

    { i: 1 }
    { i: 2 }

It is confirmed - all works correctly.
# END OF FILE


