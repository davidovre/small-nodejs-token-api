/*
* This file holds the handlers that are mapped to the route request
*/

//Handlers container
const handlers = {};

//Handler for the hello route.
handlers.hello = (data, callback) => {
    callback(200, { 'message': 'Hello, and welcome to this small node.js server api setup'});
}

//Handler for 404 not found
handlers.notFound = (data, callback) => {
    callback(404);
}

module.exports = handlers;