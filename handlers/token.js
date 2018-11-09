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
    const phone     = validator.phoneRequired(data.payload.phone);
    const password  = validator.notEmptyString(data.payload.password);

    if (phone === false || password === false) callback(400, { 'error': language.errorMessages.general.fieldsMissing });

    //Lookup the user who match that phone number. 
    _data.read('users', phone, (error, userData) => {
        if (error) callback(400, { 'error ': language.errorMessages.user.notExist });

        if (helpers.hash(data.payload.password) !== userData.hasedPassword) callback('400', { 'error': language.errorMessages.general.wrongCredentials });

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

    if (!id) callback(400, { 'error': language.errorMessages.token.missingId });

    _data.read('tokens', id, (error, tokenData) => {
        if (error) callback(404, { 'error': language.errorMessages.tokenData });
        callback(200, tokenData);
    })
}

//Token - put
handlers._tokens.put = (data, callback) => {
    const id     = validator.validateToken(data.payload.id);
    const extend = validator.validateExtend(data.payload.extend);

    if (!extend) callback(400, { 'error': language.errorMessages.general.fieldsMissing });

    _data.read('tokens', id, (error, tokenData) => {
        if (error) callback(400, { 'error': language.errorMessages.token.specyfied });

        if (tokenData.expires < dates.currentDate()) callback(400, { 'error ': language.errorMessages.token.isExpired })

        tokenData.expires = dates.futureDateTime(1000 * 60 * 60);

        _data.update('tokens', id, tokenData, (error) => {
            if (error) callback(500, { 'error': language.errorMessages.token.updateExpired })

            callback(200);
        })
    })
}

//Token - delete
handlers._tokens.delete = (data, callback) => {
    //Check if the phone number is valid 
    const id = validations.validateToken(data.queryStringObject.id);
    if (!id) callback(400, { 'error': language.errorMessages.general.fieldsMissing });

    _data.delete('tokens', id, (error, data) => {
        if (error) callback(500, { 'error': language.errorMessages.user.deleteError });
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