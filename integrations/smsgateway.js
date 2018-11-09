const validator = require('../services/validator')
const helpers   = require('../services/helper')
const language  = require('../language')
const config    = require('../config')
const https     = require('https')
const querystring = require('querystring')

const sms = {};
sms.send = (phone, message, callback) => {
    phone   = validator.validatePhone(phone);
    message = validator.isString(message);

    if(!phone || !message) callback(language.errormessages.sms.phonemessage)

    const payload = {
        'From': config.twilio.from,
        'To' : '+47'+phone,
        'Body': message
    };

    const requestDetails = {
        'portocol': 'https',
        'hostname': 'api.twolio.com',
        'method': 'POST',
        'path': '2010-04-01/Accounts/ACd9194973bc3ebd1474c9ee442d2443b2/Messages.json',
        'auth': 'ACd9194973bc3ebd1474c9ee442d2443b2:d9c57b2b8a40877092cace9b1051f128',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(querystring.stringify(payload))
        }
    }

    //Make the http request to twilio.
    const request = https.request(requestDetails, (response) => {
        const status = response.status; 
        if(status !== 200 || status !== 201) callback(language.errormessages.sms.statusreturned, status)
        callback(false);
    })

    //Bind / handeling the request errors 
    request.on('error', (e) => {
        console.log(e);
        callback(e);
    })

    request.write(querystring.stringify(payload));
    request.end();
}
module.exports = sms;