const util = require('util');
const exec = util.promisify(require('child_process').exec);

let shellExec = async function (command) {
    console.log(`running: ${command}`);
    const { _, stderr } = await exec(command);
    console.log('stderr:', stderr)
}

module.exports = shellExec;