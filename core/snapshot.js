const fs = require('fs');
const md5 = require('md5');
const path = require('path');

module.exports = (folder, ext, debug) => {
    // TODO: Add the ability to store everything in a single file.
    // TODO: Write the various configuration options into a JSON file to rerun tests.
    // TODO: Use date in the filename for the compare method.

    // This is the global objects that store the file names and hashes
    // After all promises are resolved this will be written to a JSON file.
    const fileListing = {};

    const processFile = (file, folder) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(folder, file), (error, data) => {
                if (error) {
                    reject(error);
                }

                const hash = md5(data);

                if (path.extname(file) === `.${ext}`) {
                    if (debug) {
                        console.log(`File ${file} matches the extension ${ext}.`)
                    }

                    fileListing[folder][file] = hash;
                }

                resolve();
            });
        });
    };

    const processFolder = (parentFolder) => {
        return new Promise((resolve, reject) => {
            // Set an entry in the array for each new folder.
            fileListing[parentFolder] = {};

            fs.readdir(parentFolder, (error, files) => {
                if (error) {
                    reject(error);
                }

                // Array of processFile or processFolder promises.
                const promisesArray = [];

                files.forEach((item) => {
                    const filePath = `${parentFolder}/${item}`;
                    const fileStats = fs.statSync(filePath);

                    if (fileStats.isDirectory()) {
                        if (debug) {
                            console.log(`DIRECTORY: ${filePath}`);
                        }

                        promisesArray.push(processFolder(filePath));
                    } else {
                        if (debug) {
                            console.log(`FILE: ${filePath}`);
                        }

                        promisesArray.push(processFile(item, parentFolder));
                    }
                });

                Promise.all(promisesArray).then(() => {
                    console.log('All Folders have been processed');
                    resolve();
                }, () => reject(error));
            });
        });
    };

    const writeOjects = () => {
        // Write objects to a file to compare later
        console.log('Writing files...');
        fs.writeFileSync(`../reference/${ext}FileReference.json`, JSON.stringify(file, null, 4));
    };

    const run = () => {
        return new Promise((resolve, reject) => {
            const parentStats = fs.statSync(startFolder);

            if (parentStats.isDirectory()) {
                processFolder(startFolder).then(() => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
            } else {
                reject('The parent folder MUST be a directory');
            }
        });
    };

    run().then(() => {
        writeOjects();
        return true;
    }, (error) => {
        throw new Error(error);
    });
};
