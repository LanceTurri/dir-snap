const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ensureFolderExistence = require('../helpers/ensureFolderExistence');
const isBlacklisted = require('../helpers/isBlacklistedFolder');
const snapshot = require('../core/snapshot');
const cwd = process.cwd();
const jsReference = require(path.join(cwd, 'test', 'testParent', '.dirsnap', 'jsFileReference.json'));


describe('folder utility functions', function() {
    it('can test if a folder exists', function() {
        // Create a test folder to test the utility with.
        const testFolderPath = path.join(cwd, 'test', 'testFolder');
        
        fs.mkdirSync(testFolderPath);
        const folderExists = ensureFolderExistence(testFolderPath);
        fs.rmdirSync(testFolderPath);

        assert.equal(folderExists, true);
    });

    it('can detect blacklisted folders', function() {
        const node = isBlacklisted('test/testParent/node_modules');
        const dot = isBlacklisted('test/testParent/.dirsnap');

        assert.equal((node && dot), true);
    })
});

describe('folder reference command', function() {
    it('generates a snapshot properly', function(done) {
        snapshot('test/testParent', 'js').then((fileListing) => {
            assert.deepEqual(fileListing, jsReference.files);
            done();
        }).catch((error) => { 
            done(error);
        });
    });
});
