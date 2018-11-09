/*
* This is the main file to run with node index.js 
*/

//Imports required dependencies 
const http = require('http')
const https = require('https')
const config = require('./config')
const fs = require('fs')
const language = require('./language')

//Required the unifiedServer to handle the server logic.
const unifiedServer = require('./server');

//Server options for SLL/HTTPS
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

//Creating the httpsServer
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
})

//Start the https server
httpsServer.listen(config.httpsPort, () => {
    console.log(language.server.portmessage, config.httpPort, language.server.envmessage, config.envName);
})

//Create the http server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
})

//Starts the http server
httpServer.listen(config.httpPort, () => {
    console.log(language.server.portmessage, config.httpPort, language.server.envmessage, config.envName);
})