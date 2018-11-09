/* 
* This is a validator service to validate strings and booleans. 
* Is used to validate input fields, verify tokens and so on. 
* The reason to use this service is to avoid repeating your self, and if you need to changed the 
* validator logic, you only need to do it one place. 
*/

const validator = {};

validator.notEmptyString = (string) => {
    return typeof (string) == 'string' && string.trim().length > 0 ? string.trim() : false;
}

validator.validatePhone = (number) => {
    return typeof (number) == 'string' && number.trim().length == 8 ? number.trim() : false;
}

validator.isBoolean = (boolean) => {
    return typeof (boolean) == 'boolean' && boolean == true ? true : false;
}

validator.validateToken = (token) => {
    return typeof (token) == 'string' && token.trim().length == 20 ? token.trim() : false;
}

validator.validateExtend = (extend) => {
    return typeof (extend) == 'boolean' && extend == true ? true : false;
}

validator.requiredInput = (data, field) => {
    return data !== false ? data : field + ' is required';
}

validator.isString = (string) => {
    return typeof(string) == 'string' ? string : false
}

module.exports = validator;