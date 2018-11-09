/*
* This is a helper file that contains helpers for different tasks.
*/
const crypto = require('crypto');
const config = require('../config');

const helpers = {};

helpers.hash = (string) => {
    if(typeof(string) !== 'string' && string.length < 1) return false;
    return crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
}

helpers.parseJsonToObject = (string) => {
    try {
        return JSON.parse(string);
    }catch(error) {
        return {};
    }
}

helpers.createRandomString = (number) =>{
    number = typeof(number) == 'number' && number > 0 ? number : false;

    if(!number) return false;
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
   
    let string = '';
    for(let i = 1; i <= number; i++){
        let random = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        string+=random;
    }
    return string;
}

helpers.acceptAllMethods = () => ['post', 'get', 'put', 'delete'];

module.exports = helpers;