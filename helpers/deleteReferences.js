const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const debug = require('debug')('delete');

module.exports = (referencePath) => {
    if (fs.existsSync(referencePath)) {
        const referenceStats = fs.statSync(referencePath);

        if (referenceStats.isDirectory()) {
            fs.readdirSync(referencePath).forEach((reference) => {
                fs.unlinkSync(path.join(referencePath, reference));
            });

            fs.rmdirSync(referencePath);
            debug(chalk.green(`All reference files in ${referencePath} have been deleted.`));
            return true;
        }

        fs.unlinkSync(referencePath);
        debug(chalk.green(`Reference file in ${referencePath} was deleted.`));
        return true;
    }

    debug(chalk.red(`The location ${referencePath} does not exist!`));
    return false;
};
