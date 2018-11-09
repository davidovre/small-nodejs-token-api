/*
* This file holds the environment configurations for differents environments.
*/

//This is the environment container
const env = {}

//Staging is the default environment
env.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'secret',
    'twilio': {
        'from': +'+4759447142',
        'accountSid': 'ACd9194973bc3ebd1474c9ee442d2443b2',
        'authToken': 'd9c57b2b8a40877092cace9b1051f128'
    }
}

env.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'secret',
    'twilio': {
        'from': +'+4759447142',
        'accountSid': 'ACd9194973bc3ebd1474c9ee442d2443b2',
        'authToken': 'd9c57b2b8a40877092cace9b1051f128'
    }
}

//Select the current environment configuration.
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check if the current env exsits
const envToExport = typeof(env[currentEnv]) == 'object' ? env[currentEnv] : env.staging;

//We do only export the environment that the server are using.
module.exports = envToExport;