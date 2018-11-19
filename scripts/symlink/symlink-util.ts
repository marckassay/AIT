import * as child from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';

export async function readFileAsync(filePath, err_message) {
  const readFile = promisify(fs.readFile);
  return await readFile(filePath, 'utf8')
    .then((value: string) => {
      if (value.length !== 0) {
        return Promise.resolve(value);
      } else {
        console.error(err_message);
        process.exit(1002);
      }
    })
    .catch(() => {
      console.error(err_message);
      process.exit(1002);
    });
}

export async function doesFileExistAsync(filePath, err_message?: string): Promise<boolean> {
  const doesFileExist = promisify(fs.exists);
  return await doesFileExist(filePath)
    .then((value): boolean => {
      if (value === false && err_message) {
        console.error(err_message);
        process.exit(1001);
      } else {
        return value;
      }
    })
    .catch(() => {
      console.error(err_message);
      process.exit(1001);
      return false; // superfluous, but linter wants it.
    });
}

export async function executeScriptBlock(scriptblock: string, err_message: string): Promise<string> {
  const command = scriptblock.replace(/[\{\}]/g, '');
  const execute = promisify(child.exec);
  return await execute(command)
    .then((value) => {
      if (value.stderr) {
        console.error(err_message + scriptblock);
        process.exit(1003);
      } else {
        return value.stdout.replace(/[\"\']/g, '').trimRight();
      }
    })
    .catch(() => {
      console.error(err_message + scriptblock);
      process.exit(1003);
      return '1003'; // superfluous, but linter wants it.
    });
}

export async function removeSymbolicDependencies(filePath: string, err_message: string): Promise<void> {
  const remove = promisify(fs.unlink);
  // tslint:disable-next-line:no-bitwise
  if (!checkUsersPermissions(filePath, fs.constants.W_OK | fs.constants.R_OK)) {
    console.error(err_message + filePath);
    process.exit(1004);
    return;
  }

  return await remove(filePath).catch(() => {
    console.error('Although permissions to remove file is correct, failure occurred.' +
      ' Is there another process accessing this file?: ' + filePath);
    process.exit(1004);
    return;
  });
}

/**
 * Checks the destination for exisitence, if not existent it will create a copy from source.
 */
export async function checkAndCreateACopy(source, destination, asExecutable = true): Promise<void> {
  const copy = promisify(fs.copyFile);
  return await doesFileExistAsync(destination)
    .then((value: boolean) => {
      if (value === false) {
        // node.js ^10.12.0 is at least needed for mkdirSync's recursive option.
        const destinationDirectoryPath = path.dirname(destination);
        fs.mkdirSync(destinationDirectoryPath, { recursive: true });
        return copy(source, destination)
          .then(() => {
            if (asExecutable) {
              return makeFileExecutable(destination);
            } else {
              return Promise.resolve();
            }
          });
      }
    });
}

export function createSymlink(filePath, linkPath): Promise<void> {
  fs.symlinkSync(path.resolve(filePath), path.resolve(linkPath), 'file');
  return Promise.resolve();
  /*   const slink = promisify(fs.symlink);
    console.log(path.resolve(filePath) + ' --> ' + linkPath);
    return slink(filePath, linkPath)
      .then(() => {
        console.log('linking it');
        return Promise.resolve();
      }, (reason) => {
        console.error('Cant link it');
        process.exit(1007);
        return;
      })
      .catch(() => {
        console.error('Cant link it');
        process.exit(1007);
        return;
      }); */
}

function checkUsersPermissions(filePath, mode): boolean {
  try {
    fs.accessSync(filePath, mode);
    return true;
  } catch (err) {
    return false;
  }
}

async function makeFileExecutable(filePath): Promise<void> {
  const changeMode = promisify(fs.chmod);
  // octal '0111' is expressed as: 'a+x'
  return changeMode(filePath, '0111')
    .then(() => {
      return Promise.resolve();
    }, () => {
      console.error('Unable to make the following file executable for POSIX environments: ' + filePath);
      process.exit(1006);
      return;
    })
    .catch(() => {
      console.error('Unable to make the following file executable for POSIX environments: ' + filePath);
      process.exit(1006);
      return;
    });
}

/*
const writeFileAsync = promisify(fs.writeFile);
const renameFileAsync = promisify(fs.rename);

// https://stackoverflow.com/a/46974091/648789
async function replaceTokenInFile(file, tokenExpression, replacement) {
  const contents = await this.readFileAsync(file, 'utf8');
  const replaced_contents = contents.replace(tokenExpression, replacement);
  const tmpfile = `${file}.js.tmp`;
  await this.writeFileAsync(tmpfile, replaced_contents, 'utf8');
  await this.renameFileAsync(tmpfile, file);
  return true;
}
*/
