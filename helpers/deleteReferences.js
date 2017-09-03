const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (referencePath) => {
    if (fs.existsSync(referencePath)) {
        const referenceStats = fs.statSync(referencePath);

        if (referenceStats.isDirectory()) {
            fs.readdirSync(referencePath).forEach((reference) => {
                fs.unlinkSync(path.join(referencePath, reference));
            });

            fs.rmdirSync(referencePath);
            console.log(chalk.green(`All reference files in ${referencePath} have been deleted.`));
            process.exit();
        } else {
            fs.unlinkSync(referencePath);
            console.log(chalk.green(`Reference file in ${referencePath} was deleted.`));
            process.exit();
        }
    }

    console.log(chalk.red(`The location ${referencePath} does not exist!`));
    process.exit(1);
};
