import fs from 'fs';
import util from 'util';
import path from 'path';

export const readFileAsync = util.promisify(fs.readFile);
export const writeFileAsync = util.promisify(fs.writeFile);
export const renameFileAsync = util.promisify(fs.rename);

const existsAsync = util.promisify(fs.exists);
const bashFileName = 'symlink-dependency';
const cmdFileName = 'symlink-dependency.cmd';
const jsFileName = 'symlink-generic-adaptor.js';
const exeSrcDir = './scripts/dist/dependency';
const jsSrcDir = './scripts/dist/adaptor';
const genericAdaptorPath = path.join(jsSrcDir, jsFileName);

export function prepareOutPathDir(directoryPath) {
  const batchCopyAndMake = () => {
    copyFile(jsFileName, jsSrcDir, directoryPath);
    copyFileAndMakeExecutable(directoryPath, bashFileName);
    copyFileAndMakeExecutable(directoryPath, cmdFileName);
  }

  if (fs.existsSync(directoryPath) === false) {
    fs.mkdirSync(directoryPath);
    batchCopyAndMake();
  } else {
    if (fs.existsSync(path.join(jsSrcDir, jsFileName)) === false) {
      copyFile(jsFileName, jsSrcDir, directoryPath);
    }
    if (fs.existsSync(path.join(directoryPath, bashFileName)) === false) {
      copyFileAndMakeExecutable(directoryPath, bashFileName);
    }
    if (fs.existsSync(path.join(directoryPath, cmdFileName)) === false) {
      copyFileAndMakeExecutable(directoryPath, cmdFileName);
    }
  };
}

function copyFileAndMakeExecutable(directoryPath, fileName) {
  copyFile(fileName, exeSrcDir, directoryPath);
  makeFileExecutable(path.join(directoryPath, fileName));
};

function copyFile(filename, srcDirPath, destDirPath) {
  fs.copyFileSync(path.join(srcDirPath, filename), path.join(destDirPath, filename));
}

function copyFile2(filepath, destDirPath) {
  const adaptorFileName = path.basename(filepath);

  fs.copyFileSync(filepath, path.join(destDirPath, adaptorFileName));
}

function makeFileExecutable(filePath) {
  fs.chmodSync(filePath, 'a+x');
}

function duplicateBashAndCmdFiles(newname, directory) {
  copyFile(newname, directory, directory);
  copyFile(newname + '.cmd', directory, directory);
}

// https://stackoverflow.com/a/46974091/648789
async function replaceAdaptorValueInFile(file, replace) {
  const search = '(?<=adaptor=).*$'
  let contents = await readFileAsync(file, 'utf8')
  let replaced_contents = contents.replace(search, replace)
  let tmpfile = `${file}.jstmpreplace`
  await writeFileAsync(tmpfile, replaced_contents, 'utf8')
  await renameFileAsync(tmpfile, file)
  return true
}

/**
 * Deletes if there is an existing linkpath.
 *
 * @param {string} linkFilename the filename of the symbolic link file.
 * @param {string} linkDirectoryPath the directory of where the symbolic link file will reside.
 * @param {string} linkValueDirectoryPath the directory where the exisitng file is for the symbolic link. Defaults to the value of `projectOutPath` that is set in `symlink.config.json` file
 * @param {string} adaptor the JS file where the symbolic links resolves to. Defaults to `symlink-dependency.js`.
 */
export function newSymlinkFile(linkFilename, linkDirectoryPath, linkValueDirectoryPath, adaptor?: string) {
  const commandPath = path.join(linkDirectoryPath, linkFilename);
  const linkValueBashFilePath = path.join(linkValueDirectoryPath, bashFileName);
  const linkValueCmdFilePath = path.join(linkValueDirectoryPath, cmdFileName);

  return existsAsync(commandPath)
    .then((value: boolean) => {

      if (value === true) {
        fs.unlinkSync(commandPath);
      }

      if (adaptor === undefined) {
        fs.symlinkSync(linkValueBashFilePath, commandPath, 'file');
        fs.symlinkSync(linkValueCmdFilePath, commandPath, 'file');
      } else {
        // copy bash and cmd and rename file as unique
        duplicateBashAndCmdFiles(linkFilename, linkDirectoryPath);

        // replace adaptor= in cmd and bash
        const adaptorFileName = path.basename(adaptor);
        replaceAdaptorValueInFile(path.join(linkDirectoryPath, linkFilename), adaptorFileName);
        replaceAdaptorValueInFile(path.join(linkDirectoryPath, linkFilename) + ".cmd", adaptorFileName);

        // copy adaptor pathandfile into linkValueDirectoryPath
        copyFile2(adaptor, linkValueDirectoryPath);
      }
      return Promise.resolve();
    });
}
