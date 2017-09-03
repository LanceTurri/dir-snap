const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const isBlacklisted = require('../helpers/isBlacklistedFolder');

const fileLog = require('debug')('file');
const folderLog = require('debug')('folder');

module.exports = (parentFolder, ext) => {
    // TODO: Add ability to pass in folders to exclude from matching.

    // This is the global objects that store the file names and hashes
    // After all promises are resolved this will be returned.
    const fileListing = {};

    const processFile = (file, folder) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(folder, file), (error, data) => {
                if (error) {
                    reject(error);
                }

                const hash = md5(data);

                if (path.extname(file) === `.${ext}`) {
                    fileLog(`File ${file} matches the extension ${ext}.`);
                    fileListing[folder][file] = hash;
                }

                resolve();
            });
        });
    };

    const processFolder = (folder) => {
        if (isBlacklisted(folder)) {
            // Generate an immediate promise and return it.
            return new Promise(resolve => resolve());
        }

        return new Promise((resolve, reject) => {
            // Set an entry in the array for each new folder.
            fileListing[folder] = {};

            fs.readdir(folder, (error, files) => {
                if (error) {
                    reject(error);
                }

                // Array of processFile or processFolder promises.
                const promisesArray = [];

                files.forEach((item) => {
                    const filePath = path.join(folder, item);
                    const fileStats = fs.statSync(filePath);

                    if (fileStats.isDirectory()) {
                        folderLog(`DIRECTORY: ${filePath}`);
                        promisesArray.push(processFolder(filePath));
                    } else {
                        fileLog(`FILE: ${filePath}`);
                        promisesArray.push(processFile(item, folder));
                    }
                });

                Promise.all(promisesArray).then(() => {
                    folderLog('All Folders have been processed');
                    resolve();
                }).catch(() => reject(error));
            });
        });
    };

    return new Promise((resolve, reject) => {
        let folderPath = path.join(process.cwd(), parentFolder);
        let parentStats = null;

        // HACK: If a folder is not passed in, the default path is ./
        // This causes a separator to be appended to the end of the object key
        // which will cause issues with the compare function.
        if (folderPath.lastIndexOf(path.sep) === folderPath.length - 1) {
            folderPath = folderPath.substring(0, folderPath.length - 1);
        }

        // First try to get stats on the parent directory.
        try {
            parentStats = fs.statSync(folderPath);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }

        // If it's a directory, kick off all of the promises to inspect the files.
        if (parentStats.isDirectory()) {
            processFolder(folderPath).then(() => {
                resolve(fileListing);
            }).catch((error) => {
                reject(error);
            });
        } else {
            reject('The parent folder MUST be a directory');
        }
    });
};
