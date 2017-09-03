const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (dirsnapFolder, snapshots) => {
    snapshots.forEach((snapshot) => {
        if (path.extname(snapshot) === '.json') {
            const snapshotPath = path.join(dirsnapFolder, snapshot);
            const data = JSON.parse(fs.readFileSync(snapshotPath));

            console.log(`
            NAME: ${chalk.blue(snapshot)}
            EXT:  ${chalk.blue(data.ext)}
            DATE: ${chalk.blue(data.date)}
            `);

            return true;
        }

        return false;
    });
};
