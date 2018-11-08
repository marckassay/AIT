const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
const readFileAsync = util.promisify(fs.readFile);
const existsAsync = util.promisify(fs.exists);
const bashvalue = path.resolve(path.join('scripts', 'npm-exec'));
const psvalue = path.resolve(path.join('scripts', 'npm-iex'));

/**
 * Deletes if there is an existing linkpath.
 *
 * @param {string} linkvalue
 * @param {string} linkpath
 */
async function generateSymlink(linkvalue, linkpath, removeOnly = false) {
  await fs.exists(linkpath, (exists) => {
    if (exists) { fs.unlinkSync(linkpath) };
    if (removeOnly == false) { fs.symlinkSync(linkvalue, linkpath, 'file') };
    return existsAsync(linkpath).then(() => {
      console.log("The following symlink has been created: " + linkpath);
    });
  });
};

/**
 * Calls generateSymlink with defined target and defined value for symlink.
 */
async function symlinkGenerator() {
  let globalbin;
  let jsoncontents;

  await exec(yarn + ' global bin')
    .then((value) => {
      this.globalbin = value.stdout.trim();
      return readFileAsync('symlink.config.json');
    })
    .then((json) => {
      this.jsoncontents = JSON.parse(json.toString());
      return util.promisify(() => { return; });
    })
    .then(() => {
      for (const iterator of this.jsoncontents.executables.name) {
        generateSymlink(bashvalue, path.join(this.globalbin, iterator));
        generateSymlink(bashvalue, path.join(this.globalbin, iterator + '.cmd'));
        generateSymlink(psvalue, path.join(this.globalbin, iterator + '.ps1'));
        generateSymlink(psvalue, path.join(this.globalbin, iterator + '.cmd.ps1'));
      }
    });
}
symlinkGenerator();
