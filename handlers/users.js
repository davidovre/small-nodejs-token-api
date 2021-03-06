const validator = require('../services/validator');
const helpers = require('../services/helper');
const language = require('../language');
const tokenHandler = require('./token');
const _data = require('../services/crud');

const handlers = {};
handlers.users = (data, callback) => {
    const accaptableMethods = ['post', 'get', 'put', 'delete'];
    if (accaptableMethods.indexOf(data.method) === -1) callback(405);
    handlers._users[data.method](data, callback);
}

//Users child handler container 
handlers._users = {};
handlers._users.post = (data, callback) => {
    // Validate the required input fields with the validator service.
    const firstName     = validator.notEmptyString(data.payload.firstName);
    const lastName      = validator.notEmptyString(data.payload.lastName);
    const phone         = validator.validatePhone(data.payload.phone);
    const password      = validator.notEmptyString(data.payload.password);
    const tosAgreement  = validator.isBoolean(data.payload.tosAgreement);

    //Check if there are any missing fields and return a payload with missing fields
    if (firstName === false || lastName === false || phone === false || password === false || tosAgreement === false) {
        callback(400, [
            { 'Error': language.errormessages.general.fieldsmissing },
            {
                'firstName':    validator.requiredInput(firstName, 'Firstname'),
                'lastName':     validator.requiredInput(lastName, 'Lastname'),
                'phone':        validator.requiredInput(phone, 'Phone'),
                'password':     validator.requiredInput(password, 'Password'),
                'tosAgreement': validator.requiredInput(tosAgreement, 'Concent'),
            }
        ]);
        return false;
    }

    // Making sure that the user does not exist already
    _data.read('users', phone, (error, data) => {
        if (!error) callback(400, { 'error': language.errormessages.user.userexist })

        // Hasing the password using our hash password helper.
        const hasedPassword = helpers.hash(password);

        // Making sure the password hashing went well, if not return error message.
        if (!hasedPassword) callback(500, { 'error': language.errormessages.user.hashpassword });

        //Now we create the user object
        const userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hasedPassword': hasedPassword,
            'tosAgreement': tosAgreement
        }

        // Storing/Saving the user data on disc
        _data.create('users', phone, userObject, (error) => {
            if (error) callback(500, { 'error': language.errormessages.user.created });
            callback(200, { message: language.successmessages.user.created })
        })
    });
}

//Create the methods 
handlers._users.get = (data, callback) => {
    //Check if the phone number is valid 
    const phone = validator.validatePhone(data.queryStringObject.phone);
    if (!phone) callback(400, { 'error': language.errormessages.general.fieldsmissing });

    //Get the token from the headers and check if its a string with our validator service.
    const token = validator.isString(data.headers.token);

    //Verify the token from the headers i valid 
    tokenHandler._tokens.verifyToken(token, phone, (tokenIsValid) => {
        if (!tokenIsValid) callback(403, { 'error': language.errormessages.general.noaccess })

        _data.read('users', phone, (error, data) => {
            if (error) callback(404, { 'error': language.errormessages.user.notexist });

            //We removed the hashedPassword for security reason, and the user should not see it.
            delete data.hasedPassword;
            callback(200, data);
        })
    })
}

//Create the methods 
handlers._users.put = (data, callback) => {
    const phone = validations.validatePhone(data.payload.phone);
    if (!phone) callback(400, { 'error': language.errormessages.user.notexist })

    //Check for the option fields 
    const firstName = validator.notEmptyString(data.payload.firstName);
    const lastName  = validator.notEmptyString(data.payload.lastName);
    const password  = validator.notEmptyString(data.payload.password);

    if (phone === false) callback(400, { 'error': language.errormessages.user.missingphonenumber })
    if (firstName === false && lastName === false && password === false) callback(400, { 'error': language.errormessages.general.somefields })

    _data.read('users', phone, (error, userData) => {
        if (error) callback(400, { 'error': language.errormessages.user.notexist });

        if (firstName) userData.firstName = firstName;
        if (lastName) userData.lastName = lastName;
        if (password) userData.hasedPassword = helpers.hash(password);

        _data.update('users', phone, userData, (error) => {
            if (error) callback(500, { 'error': language.errormessages.general.updateError });
            callback(200);
        })
    })
}

//Create the methods 
handlers._users.delete = (data, callback) => {
    //Check if the phone number is valid 
    const phone = validations.validatePhone(data.queryStringObject.phone);
    if (!phone) callback(400, { 'error': language.errormessages.general.fieldsmissing });

    _data.delete('users', phone, (error, data) => {
        if (error) callback(500, { 'error': language.errormessages.user.deleteerror });
        //Removed the hased password from the user object 
        callback(200);
    })
}

module.exports = handlers;