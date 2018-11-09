/*
* Libary for stroing and editing data
*/

//Dependecies 
const fs = require('fs');
const path = require('path');
const helpers = require('../services/helper');

//Container for this modules 
const lib = {};

//Define the base directory
lib.baseDir = path.join(__dirname, '/../.data/');

//Write data to a file 
lib.create = (dir, file, data, callback) => {
    //Open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (error, fileDescriptor) => {
        if (error) callback('Could not create new file, it may already exist');

        //Convert data to string 
        const stringData = JSON.stringify(data);

        //Write to file and then close it
        fs.writeFile(fileDescriptor, stringData, (error) => {
            if (error) callback('Error writing to new file');

            fs.close(fileDescriptor, (error) => {
                if (error) callback('Error closeing the new file');

                callback(false);
            });
        });
    });
}

lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (error, data) => {
        if (error) callback(500, { 'Error': data })
        callback(false, helpers.parseJsonToObject(data));
    })
}

lib.update = (dir, file, data, callback) => {
    //Open the file for writing 
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (error, fileDescriptor) => {
        if (error) callback('Could not open the file for update - it may not exist yet');

        const stringData = JSON.stringify(data);
        
        //Truncate the file
        fs.truncate(fileDescriptor, (error) => {
            if (error) callback('Erroring while truncate the file')

            //write to the file and close it

            fs.writeFile(fileDescriptor, stringData, (error) => {
                if (error) callback('Error writing to exsiting file');

                fs.close(fileDescriptor, (error) => {
                    if (error) callback('There was an error closing the file');

                    callback(false);
                });
            })
        })
    })
}

//Delete the file
lib.delete = (dir, file, callback) => {
    //Unlik 
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (error) => {
        if (error) callback('Error to delete the file');

        callback(false);
    })
}

module.exports = lib;