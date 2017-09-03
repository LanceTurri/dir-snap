const fs = require('fs');

module.exports = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        return true;
    }

    return false;
};
