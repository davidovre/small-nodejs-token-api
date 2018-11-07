/*
* This is the main file to run with node index.js 
*/

//Imports required dependencies 
const http = require('http');
const https = require('https');
const config = require('./config');
const fs = require('fs');

//Required the unifiedServer to handle the server logic.
const unifiedServer = require('./unifiedServer');

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
    console.log(`The server is listen on port ${ config.httpsPort } and its running in following env: ${ config.envName }`);
})

//Create the http server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
})

//Starts the http server
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listen on port ${ config.httpPort } and its running in following env: ${ config.envName }`);
})