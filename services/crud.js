/*
*    CRUD service is created to write, read, update, and deleting from the disc.
*/

// Necessary dependecies
const fs = require('fs');
const path = require('path');
const helpers = require('../services/helper');

//Container for this modules 
const crud = {};

//Define the base directory
crud.baseDir = path.join(__dirname, '/../.data/');

//Write data to file
crud.create = (dir, file, data, callback) => {

    // Creating the file - for store data to it.
    fs.open(crud.baseDir + dir + '/' + file + '.json', 'wx', (error, fileDescriptor) => {
        if (error) callback('Could not create new file, it may already exist');

        const stringData = JSON.stringify(data);

        // Write data to the new file.
        fs.writeFile(fileDescriptor, stringData, (error) => {
            if (error) callback('Error writing to new file');

            fs.close(fileDescriptor, (error) => {
                if (error) callback('Error closeing the new file');

                callback(false);
            });
        });
    });
}

crud.read = (dir, file, callback) => {
    fs.readFile(crud.baseDir + dir + '/' + file + '.json', 'utf-8', (error, data) => {
        if (error) callback(500, { 'Error': data })
        callback(false, helpers.parseJsonToObject(data));
    })
}

crud.update = (dir, file, data, callback) => {

    //Open the selected file for writing.
    fs.open(crud.baseDir + dir + '/' + file + '.json', 'r+', (error, fileDescriptor) => {
        if (error) callback('Could not open the file for update - it may not exist yet');

        const stringData = JSON.stringify(data);
        
        // Truncate the file
        fs.truncate(fileDescriptor, (error) => {
            if (error) callback('Erroring while truncate the file')

            // Write data to the selected file
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
crud.delete = (dir, file, callback) => {
    //Unlik 
    fs.unlink(crud.baseDir + dir + '/' + file + '.json', (error) => {
        if (error) callback('Error to delete the file');

        callback(false);
    })
}

module.exports = crud;