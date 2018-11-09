//Required handlers. 
const userHandler   = require('../handlers/users');
const tokenHandler  = require('../handlers/token');

//Router holds routes and map to correct handler
const router = {
    'users': userHandler.users,
    'tokens': tokenHandler.tokens
}
module.exports = router;
