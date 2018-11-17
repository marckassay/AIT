import * as child from 'child_process';
import * as fs from 'fs';
import { join, basename } from 'path';
import { promisify } from 'util';

export const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const renameFileAsync = promisify(fs.rename);
const doesFileExistAsync = promisify(fs.exists);
const exec = promisify(child.exec);

// called once during startup and for every custom command
export async function deployFromScriptsToOut(name: string, adaptor?: string) {
  // copy bash file to out/* dir ...if name is not generic, than modify file to handle custom
  //   adaptor then copy into temp dir, rename and copy ino out/*
  // copy cmd file to out/* dir ...if name is not generic, than modify file to handle custom
  //   adaptor then copy into temp dir, rename and copy ino out/*
  // copy JS file to out/* dir ...if name is not generic, than take adaptor path and then 0copy that JS file to out/*
  return await Promise.resolve();
}

// called once per command listed in the dependencies [] of the config. also, is function must be
// called after deployFromScriptsToOut, since that adds the generic and custom (if any). this in-turn
// creates a new symlink in globalenv
export async function deployFromOutToGlobalEnv(name: string, adaptor?: string) {
  return await Promise.resolve();
}

function copyFileAndMakeExecutable(directoryPath, fileName) {
  copyFile(fileName, scriptsDependencyDirPath, directoryPath);
  makeFileExecutable(join(directoryPath, fileName));
}

function copyFile(filename, srcDirPath, destDirPath) {
  fs.copyFileSync(join(srcDirPath, filename), join(destDirPath, filename));
}

function copyFile2(filepath, destDirPath) {
  const adaptorFileName = basename(filepath);

  fs.copyFileSync(filepath, join(destDirPath, adaptorFileName));
}

function makeFileExecutable(filePath) {
  fs.chmodSync(filePath, '0111'); // 'a+x'
}

// https://stackoverflow.com/a/46974091/648789
async function replaceAdaptorValueInFile(file, replace) {
  const search = '(?<=adaptor=).*$';
  const contents = await readFileAsync(file, 'utf8');
  const replaced_contents = contents.replace(search, replace);
  const tmpfile = `${file}.jstmpreplace`;
  await writeFileAsync(tmpfile, replaced_contents, 'utf8');
  await renameFileAsync(tmpfile, file);
  return true;
}

async function executeScriptBlock(scriptblock: string) {
  let results;
  const command = scriptblock.replace(/[\{\}]/g, '');
  await exec(command)
    .then((value) => {
      if (value.stderr) {
        results = '1';
      } else {
        results = value.stdout.replace(/[\"\']/g, '').trimRight();
      }
    })
    .catch(() => {
      results = '1';
    });

  if (results === '1') {
    throw new Error('The following scriptblock failed to execute: ' + scriptblock);
  }

  return results;
}

