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

  const bashFileName = 'symlink-dependency';
  const cmdFileName = 'symlink-dependency.cmd';
  const jsFileName = 'symlink-dependency.js';

  const destinationFolder = path.resolve(path.join('out', 'out-scripts'));
  const srcFolder = path.resolve(path.join('scripts', 'symlink'));

  // TODO: npmAsYarn setting
  // TODO: symlinkPath setting
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
      const dependencyDirPath = path.join(srcFolder, 'dependency');
      copyFileToOutScripts(bashFileName, dependencyDirPath, destinationFolder);
      copyFileToOutScripts(cmdFileName, dependencyDirPath, destinationFolder);
      copyFileToOutScripts(jsFileName, dependencyDirPath, destinationFolder);

      chmodFileToExe(path.join(destinationFolder, bashFileName));

      return util.promisify(() => { return; });
    })
    .then(() => {
      run = async () => {
        for (const name of this.jsoncontents.dependencies.name) {
          await generateSymlink(path.join(destinationFolder, bashFileName), path.join(this.globalbin, name));
          await generateSymlink(path.join(destinationFolder, cmdFileName), path.join(this.globalbin, name + '.cmd'));
          // await generateSymlink(path.join(destinationFolder, jsFileName), path.join(this.globalbin, name + '.js'));
        }
        return util.promisify(() => { return; });
      }
      return run();
    })
    .then(() => {
      const npmFileName = 'symlink-npm-wrapper';
      const srcFolder = path.resolve(path.join('scripts', 'generated', 'npm'));
      copyFileToOutScripts(npmFileName, srcFolder, destinationFolder);
      copyFileToOutScripts(npmFileName + ".cmd", srcFolder, destinationFolder);
      copyFileToOutScripts(npmFileName + ".js", srcFolder, destinationFolder);
      //fs.renameSync(path.join(destinationFolder, npmFileName + ".js"), path.join(destinationFolder, npmFileName));
      chmodFileToExe(path.join(destinationFolder, npmFileName));

      run = async () => {
        await generateSymlink(path.join(destinationFolder, bashFileName), path.join(this.globalbin, '/../', 'npm'));
        await generateSymlink(path.join(destinationFolder, cmdFileName), path.join(this.globalbin, '/../', 'npm.cmd'));
      };
      run();
      return util.promisify(() => { return; });
    });
}

symlinkGenerator();
