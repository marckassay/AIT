import * as child from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';

export async function readFileAsync(path, err_message) {
  const readFile = promisify(fs.readFile);
  return await readFile(path, 'utf8')
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

export async function doesFileExistAsync(path, err_message?: string): Promise<boolean> {
  const doesFileExist = promisify(fs.exists);
  return await doesFileExist(path)
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

export async function removeSymbolicDependencies(path: string, err_message: string): Promise<void> {
  const remove = promisify(fs.unlink);
  // tslint:disable-next-line:no-bitwise
  if (!checkUsersPermissions(path, fs.constants.W_OK | fs.constants.R_OK)) {
    console.error(err_message + path);
    process.exit(1004);
    return;
  }

  return await remove(path).catch(() => {
    console.error('Although permissions to remove file is correct, failure occurred.' +
      ' Is there another process accessing this file?: ' + path);
    process.exit(1004);
    return;
  });
}

/**
 * Checks the destination for exisitence, if not existent it will create a copy from source.
 */
export async function checkAndCreateACopy(source, destination): Promise<void> {
  const copy = promisify(fs.copyFile);

  return await doesFileExistAsync(destination)
    .then((value: boolean) => {
      if (value === false) {
        makeFileExecutable(destination);
        return copy(source, destination);
      }
    });
}

export async function symlink(filePath, linkPath): Promise<void> {
  const link = promisify(fs.symlink);

  return link(filePath, linkPath);
}

function checkUsersPermissions(path, mode): boolean {
  try {
    fs.accessSync(path, mode);
    return true;
  } catch (err) {
    return false;
  }
}

function makeFileExecutable(filePath) {
  fs.chmodSync(filePath, '0111'); // 'a+x'
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
