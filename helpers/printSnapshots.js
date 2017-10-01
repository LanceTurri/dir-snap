const fs = require('fs');
const path = require('path');
const cliff = require('cliff');
const debug = require('debug')('list');

module.exports = (dirsnapFolder, snapshots) => {
    const snapshotTable = [];
    snapshots.forEach((snapshot) => {
        if (path.extname(snapshot) === '.json') {
            const snapshotPath = path.join(dirsnapFolder, snapshot);
            const data = JSON.parse(fs.readFileSync(snapshotPath));

            debug(data);

            snapshotTable.push({
                EXT: (data.ext).cyan.bold,
                DATE: (data.date).blue,
                FILE: (snapshot).gray,
            });
        }
    });

    console.log('');
    cliff.putObjectRows('data', snapshotTable, ['EXT', 'DATE', 'FILE']);
    console.log('');
};
