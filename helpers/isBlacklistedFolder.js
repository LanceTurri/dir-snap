const path = require('path');

module.exports = (folder) => {
    // EX: test/testParent/node_modules
    if (folder.includes('node_modules')) {
        return true;
    }

    // We check for /. or \\. in the folder string
    // EX: test/testParent/.dirsnap or test\\testParent\\.dirsnap
    // eslint-disable-next-line prefer-template
    if (folder.includes(`${path.sep}.`)) {
        return true;
    }

    return false;
};
