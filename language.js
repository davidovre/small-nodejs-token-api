/*
* This is a language file. Here we store static messages or language stuff
*/
const language = {
    "errormessages": {
        "general": {
            "fieldsmissing": "Missing one or more required field(s)",
            "noAccess": "You do not have access to this resource",
            "somefields": "You need to send in one or more fields",
            "updateError": "Something went wrong while updating the record, please try again",
            "wrongcredentials": "Wrong username or password, please try again"
        },
        "user": {
            "userexist": "A user with the current phonenumber already exists",
            "created": "There was a problem with creating the user, please try again",
            "hashpassword": "Something went wrong while hasing the password, please try again",
            "notexist": "The user does not exist",
            "missingphonenumber": "Please specify phonenumber",
            "deleteerror": "Can not delete user, please try again"
        },
        "token": {
            "missingid": "Missing the required ID",
            "tokendata": "Can not find any token data",
            "specyfied": "The specyfied token does not exist",
            "isexpired": "The token is already expired",
            "updateexpired": "There was a problem with updating the expire date"
        }
    },
    "successmessages": {
        "user": {
            "created": "The user has been created successfully"
        }
    },
    "server": {
        "port": "port",
        "portmessage": "The server is listen to port:",
        "envmessage": "The server is running in the following env:"
    }
}
module.exports = language;