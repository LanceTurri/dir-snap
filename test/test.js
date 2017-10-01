const fs = require('fs');
const path = require('path');
const assert = require('assert');
const cwd = process.cwd();

// Core files
const snapshot = require('../core/snapshot');

// Helper file includes
const ensureFolderExistence = require('../helpers/ensureFolderExistence');
const isBlacklisted = require('../helpers/isBlacklistedFolder');
const deleteReferences = require('../helpers/deleteReferences');

// UTILITY FUNCTIONS
// ============================================================================
describe('UTILITY: ensureFolderExistence.js', function() {
    it('returns true if a folder exists', function() {
        // Create a test folder to test the utility with.
        const testFolderPath = path.join(cwd, 'test', 'testFolder');
        
        fs.mkdirSync(testFolderPath);
        const folderExists = ensureFolderExistence(testFolderPath);
        fs.rmdirSync(testFolderPath);

        assert.equal(folderExists, true);
    });

    it('returns false if a folder does not exist', function() {
        // Create a test folder to test the utility with.
        const testFolderPath = path.join(cwd, 'test', 'testFolder');
        assert.equal(ensureFolderExistence(testFolderPath), false);
    });
});

describe('UTIITY: isBlacklistedFolder.js', function() {
    it('returns true if folder is blacklisted', function() {
        const node = isBlacklisted('test/testParent/node_modules');
        const dot = isBlacklisted('test/testParent/.dirsnap');

        assert.equal((node && dot), true);
    });

    it('returns false if folder is not blacklisted', function() {
        const randomFolder = isBlacklisted('test/testParent/random');

        assert.equal(randomFolder, false);
    });
});

describe('UTILITY: deleteReferences.js', function() {
    it('deletes a single reference file', function() {
        const referencePath = path.join(cwd, 'test', 'testParent', '.dirsnap', 'testFileReference.json');
        
        // Create a dummy reference file and then delete it with the utility method.
        fs.writeFileSync(referencePath, '{"test": true}');
        deleteReferences(referencePath);

        assert.equal(fs.existsSync(referencePath), false);
    });

    it('deletes all reference files', function() {
        const referencePath = path.join(cwd, 'test', '.dirsnap');
        
        // Create a dummy reference folder and then delete it with the utility method.
        fs.mkdirSync(referencePath);
        fs.writeFileSync(path.join(referencePath, 'firstReference.json'), '{"test": true}');
        fs.writeFileSync(path.join(referencePath, 'secondReference.json'), '{"test": true}');
        deleteReferences(referencePath);

        assert.equal(fs.existsSync(referencePath), false);
    });

    it('deletes all reference files', function() {
        const referencePath = path.join(cwd, 'test', '.dirsnap');
        
        // Create a dummy reference folder and then delete it with the utility method.
        fs.mkdirSync(referencePath);
        fs.writeFileSync(path.join(referencePath, 'firstReference.json'), '{"test": true}');
        fs.writeFileSync(path.join(referencePath, 'secondReference.json'), '{"test": true}');
        deleteReferences(referencePath);

        assert.equal(fs.existsSync(referencePath), false);
    });

    it('fails gracefully when path does not exist', function() {
        const referencePath = path.join(cwd, 'test', '.dirsnap');
        const returnBoolean = deleteReferences(referencePath);

        assert.equal(returnBoolean, false);
    });
});

// COMMAND FUNCTIONS
// ============================================================================
describe('dirsnap reference command', function() {
    it('generates a snapshot properly', function() {
        const referencePath = path.join('test', 'testParent');
        return snapshot(referencePath, 'js').then((fileListing) => {
            assert.ok(fileListing);
        });
    });

    it('handles a path that does not exist', function() {
        const nonexistentFolderPath = path.join('test', 'iDoNotExist');
        return snapshot(nonexistentFolderPath, 'js').catch((error) => { 
            // Just test that an error was properly returned.
            assert.equal(error, 'Error: Cannot get stats on the path passed in.');
        });
    });

    it('handles a file passed in instead of a directory', function() {
        const filePath = path.join('test', 'testParent', '.dirsnap', 'jsFileReference.json');
        return snapshot(filePath, 'js').catch((error) => { 
            // Just test that an error was properly returned.
            assert.equal(error, 'Error: The parent folder MUST be a directory');
        });
    });
});
