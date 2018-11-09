/*
* This is a language file. Here we store static messages or language stuff
*/
const language = {
    "errorMessages": {
        "general": {
            "fieldsMissing": "Missing one or more required field(s)",
            "noAccess": "You do not have access to this resource",
            "someFields": "You need to send in one or more fields",
            "updateError": "Something went wrong while updating the record, please try again",
            "wrongCredentials": "Wrong username or password, please try again"
        },
        "user": {
            "userexist": "A user with the current phonenumber already exists",
            "created": "There was a problem with creating the user, please try again",
            "hashpassword": "Something went wrong while hasing the password, please try again",
            "notExist": "The user does not exist",
            "phoneMissingField": "Please specify phonenumber",
            "deleteError": "Can not delete user, please try again"
        },
        "token": {
            "missingId": "Missing the required ID",
            "tokenData": "Can not find any token data",
            "specyfied": "The specyfied token does not exist",
            "isExpired": "The token is already expired",
            "updateExpired": "There was a problem with updating the expire date"
        }
    },
    "successMessages": {
        "user": {
            "created": "The user has been created successfully"
        }
    },
    "server": {
        "port": "port",
        "portMessage": "The server is listen to port:",
        "envMessage": "The server is running in the following env:"
    }
}
module.exports = language;