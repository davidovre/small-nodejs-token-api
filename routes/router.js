//Import required dependencies.
const  handlers = require('./handlers')

//Router object to hold routes
const router = {
    'hello' : handlers.hello
}

module.exports = router;
