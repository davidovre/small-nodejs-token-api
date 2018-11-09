/*
*  This file holds the server logic
*/

//Imports the required dependencies.
const router = require('./routes/router');
const defaultHandler = require('./handlers/default');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./services/helper');

//This UnifiedServer function handles the server logic.
const unifiedServer = (req, res) => {

    // Get the request url and then parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the pathname for the url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object. 
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method and set it to lowercase.
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    //Get the payload if there is any 
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : defaultHandler.notFound;

        // Construct the data object
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        }

        // Route the request to the handler specify in the router
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};

            //Convert payload to a string 
            const payloadString = JSON.stringify(payload);

            //Return response 
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            //Log the path the user asked for
            console.log('we are returning', statusCode, payloadString);
        })
    })
}

module.exports = unifiedServer;