/*
* This file includes the default handlers for the application
*/

handlers = {};

handlers.notFound = (data, callback) => {
    callback(404);
}
module.exports = handlers;