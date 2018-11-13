const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
const readFileAsync = util.promisify(fs.readFile);
const existsAsync = util.promisify(fs.exists);

function copyFileToOutScripts(filename, srcDir, destDir) {
  if (fs.existsSync(destDir) === false) {
    fs.mkdirSync(destDir);
  }

  fs.copyFileSync(path.join(srcDir, filename), path.join(destDir, filename));
  fs.copyFileSync(path.join(srcDir, filename), path.join(destDir, filename));
}

function chmodFileToExe(path) {
  fs.chmodSync(path, 'a+x');
}

/**
 * Deletes if there is an existing linkpath.
 *
 * @param {string} linkvalue
 * @param {string} linkpath
 */
function generateSymlink(linkvalue, linkpath) {
  return existsAsync(linkpath)
    .then((value) => {
      if (value) {
        fs.unlinkSync(linkpath);
      }
      fs.symlinkSync(linkvalue, linkpath, 'file');
      return Promise.resolve();
    })
    .then(() => {
      return existsAsync(linkpath).then(() => {
        console.log("The following symlink has been created: " + linkpath);
      });
    });
};

/**
 * Calls generateSymlink with defined target and defined value for symlink.
 */
function symlinkGenerator() {
  let globalbin;
  let jsoncontents;
  const bashFileName = 'npm-exec';
  const cmdFileName = 'npm-cmd';
  const psFileName = 'npm-iex';
  const destinationFolder = path.resolve(path.join('out', 'out-scripts'));
  const srcFolder = path.resolve(path.join('scripts', 'symlink'));

  exec(yarn + ' global bin')
    .then((value) => {
      this.globalbin = value.stdout.trim();
      return readFileAsync('symlink.config.json');
    })
    .then((json) => {
      this.jsoncontents = JSON.parse(json.toString());
      return util.promisify(() => { return; });
    })
    .then(() => {
      copyFileToOutScripts(bashFileName, srcFolder, destinationFolder);
      copyFileToOutScripts(psFileName, srcFolder, destinationFolder);
      chmodFileToExe(path.join(destinationFolder, bashFileName));
      chmodFileToExe(path.join(destinationFolder, psFileName));
      return util.promisify(() => { return; });
    })
    .then(() => {
      run = async () => {
        for (const name of this.jsoncontents.executables.name) {
          await generateSymlink(path.join(destinationFolder, bashFileName), path.join(this.globalbin, name));
          await generateSymlink(path.join(destinationFolder, cmdFileName), path.join(this.globalbin, name + '.cmd'));
          await generateSymlink(path.join(destinationFolder, psFileName), path.join(this.globalbin, name + '.ps1'));
        }
        return util.promisify(() => { return; });
      }
      return run();
    })
    .then(() => {
      const npmFileName = 'npm-nodewrapper';
      const srcFolder = path.resolve(path.join('scripts', 'generated'));
      copyFileToOutScripts(npmFileName + ".js", srcFolder, destinationFolder);
      fs.renameSync(path.join(destinationFolder, npmFileName + ".js"), path.join(destinationFolder, npmFileName));
      chmodFileToExe(path.join(destinationFolder, npmFileName));

      run = async () => {
        await generateSymlink(path.join(destinationFolder, npmFileName), path.join(this.globalbin, '/../', 'npm'));
      };
      run();
      return util.promisify(() => { return; });
    });
}

symlinkGenerator();
