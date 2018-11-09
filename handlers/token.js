const helpers   = require('../services/helper');
const language  = require('../language');
const validator = require('../services/validator');
const dates     = require('../services/date');
const _data     = require('../services/crud');

const handlers = {};

handlers.tokens = (data, callback) => {
    const accaptableMethods = helpers.acceptAllMethods;
    if (accaptableMethods.indexOf(data.method) === -1) callback(405);
    handlers._tokens[data.method](data, callback);
}

//Token container 
handlers._tokens = {}

//Token - post
handlers._tokens.post = (data, callback) => {
    const phone     = validator.validatePhone(data.payload.phone);
    const password  = validator.notEmptyString(data.payload.password);

    if (phone === false || password === false) callback(400, { 'error': language.errormessages.general.fieldsmissing });

    //Lookup the user who match that phone number. 
    _data.read('users', phone, (error, userData) => {
        if (error) callback(400, { 'error ': language.errormessages.user.notexist });

        if (helpers.hash(data.payload.password) !== userData.hasedPassword) callback('400', { 'error': language.errormessages.general.wrongcredentials });

        const tokenId = helpers.createRandomString(20);
        const expires = dates.futureDateTime(1000 * 60 * 60);

        const tokenObject = {
            'phone': phone,
            'id': tokenId,
            'expire': expires
        }

        _data.create('tokens', tokenId, tokenObject, (error) => {
            if (error) callback(500, { 'error': error });

            callback(200, tokenObject);
        })

    });
}

//Token - get
handlers._tokens.get = (data, callback) => {
    const id = validator.validateToken(data.queryStringObject.id);

    if (!id) callback(400, { 'error': language.errormessages.token.missingid });

    _data.read('tokens', id, (error, tokenData) => {
        if (error) callback(404, { 'error': language.errormessages.tokendata });
        callback(200, tokenData);
    })
}

//Token - put
handlers._tokens.put = (data, callback) => {
    const id     = validator.validateToken(data.payload.id);
    const extend = validator.validateExtend(data.payload.extend);

    if (!extend) callback(400, { 'error': language.errormessages.general.fieldsmissing });

    _data.read('tokens', id, (error, tokenData) => {
        if (error) callback(400, { 'error': language.errormessages.token.specyfied });

        if (tokenData.expires < dates.currentDate()) callback(400, { 'error ': language.errormessages.token.isexpired })

        tokenData.expires = dates.futureDateTime(1000 * 60 * 60);

        _data.update('tokens', id, tokenData, (error) => {
            if (error) callback(500, { 'error': language.errormessages.token.updateexpired })

            callback(200);
        })
    })
}

//Token - delete
handlers._tokens.delete = (data, callback) => {
    //Check if the phone number is valid 
    const id = validations.validateToken(data.queryStringObject.id);
    if (!id) callback(400, { 'error': language.errormessages.general.fieldsmissing });

    _data.delete('tokens', id, (error, data) => {
        if (error) callback(500, { 'error': language.errormessages.user.deleteerror });
        //Removed the hased password from the user object 
        callback(200);
    })
}

handlers._tokens.verifyToken = (id, phone, callback) => {
    //Look up the token
    _data.read('tokens', id, (error, tokenData) => {
        if (error) callback(false)

        //Check if the token is for the given user 
        if (tokenData.phone !== phone && tokenData < dates.currentDate()) callback(false);
        callback(ture);
    })
}
module.exports = handlers;