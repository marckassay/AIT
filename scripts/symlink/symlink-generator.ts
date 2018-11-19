import * as util from './symlink-util';
import { join } from 'path';

interface SymlinkConfig {
  projectOutPath: string;
  dependencies: [{
    name: string,
    symlinkPath: string,
    adaptor?: string
  }];
}

/**
 * Relative path from project contains `genericBashDependencyFileName` and `genericCmdDependencyFileName`.
 */
const scriptsDependencyDirPath = './scripts/symlink/dependency';

/**
 * Relative path from project that contains `genericAdaptorFileName`.
 */
const scriptsAdaptorDirPath = './scripts/dist/adaptor';


const genericBashDependencyFileName = 'dependency_symlink';
const genericCmdDependencyFileName = 'dependency_symlink.cmd';
const genericAdaptorFileName = 'adaptor.js';

/**
 * The location to the `out` folder. This is intended to reside at the project root directory.
 */
let outDirPath: string;

const scriptsGenericBashDependency: string = join(scriptsDependencyDirPath, genericBashDependencyFileName);
function outGenericBashDependency(): string {
  return join(outDirPath, genericBashDependencyFileName);
}

const scriptsGenericCmdDependency: string = join(scriptsDependencyDirPath, genericCmdDependencyFileName);
function outGenericCmdDependency(): string {
  return join(outDirPath, genericCmdDependencyFileName);
}

const scriptsGenericAdaptor: string = join(scriptsAdaptorDirPath, genericAdaptorFileName);
function outGenericAdaptor(): string {
  return join(outDirPath, genericAdaptorFileName);
}

const configFilename = 'symlink.config.json';

/**
 * Reads the `symlink-config.json` by iterating the dependencies section of the file to create
 * symlinks. These symlinks are intended to reside in a location listed in the env's PATH so that
 * the CLI, IDE, node and/or any executable will find it "globally" but since symbolic will call the
 * local package. If called outside of project's directory will command will fail and if called in
 * another project with same symbolic links, it will seek for the package(s) for that project.
 *
 * This is developed to work on POSIX and Windows.
 */
async function generate() {
  /**
   * JS Object that represents `symlink.config.json` contents.
   */
  let config: SymlinkConfig;

  await util.doesFileExistAsync(configFilename, 'Unable to load symlink.config.json');

  const configRaw: string = await util.readFileAsync(configFilename, 'Unable to read symlink.config.json') as string;

  try {
    config = JSON.parse(configRaw);
    outDirPath = config.projectOutPath;
  } catch (error) {
    throw new Error('Unable to parse symlink.config.json into a JSON object.');
  }

  for (const dependency of config.dependencies) {
    await newSymbolicDependency(dependency.name, dependency.symlinkPath, dependency.adaptor);
  }
}

/**
* Deletes if there is an existing link
*
* @param {string} symbolicName the filename of the symbolic link file.
* @param {string} symbolicDirectoryPath the directory of where the symbolic link file will reside.
* @param {string} adaptor the JS file where the symbolic links resolves to. Defaults to `symlink-dependency.js`.
*/
async function newSymbolicDependency(symbolicName: string, symbolicDirectoryPath: string, adaptor?: string) {
  let bashDependencyValue: string;
  let cmdDependencyValue: string;

  // resolve commandDirectoryPath if its in a scriptblock (or partial scriptblock which must fail).
  if (symbolicDirectoryPath.startsWith('{') || symbolicDirectoryPath.endsWith('}')) {
    symbolicDirectoryPath = await util.executeScriptBlock(symbolicDirectoryPath, 'Unable to execute the following scriptblock: ');
  }

  const symbolicFilePath: string = join(symbolicDirectoryPath, symbolicName);
  await checkAndRemoveExisitingSymbolicFiles(symbolicFilePath);

  if (!adaptor) {
    await util.checkAndCreateACopy(scriptsGenericBashDependency, outGenericBashDependency());
    await util.checkAndCreateACopy(scriptsGenericCmdDependency, outGenericCmdDependency(), false);
    await util.checkAndCreateACopy(scriptsGenericAdaptor, outGenericAdaptor(), false);

    bashDependencyValue = outGenericBashDependency();
    cmdDependencyValue = outGenericCmdDependency();
  } else {
    bashDependencyValue = symbolicName + '_' + outGenericBashDependency();
    cmdDependencyValue = symbolicName + '_' + outGenericCmdDependency();

    // replaceTokenInFile(bashDependencyValue ,'(?<=adaptor=).*$',adaptorValue);
  }

  await util.createSymlink(bashDependencyValue, symbolicFilePath);
  await util.createSymlink(cmdDependencyValue, symbolicFilePath + '.cmd');
}

async function checkAndRemoveExisitingSymbolicFiles(path: string) {
  await util.doesFileExistAsync(path)
    .then((value: boolean) => {
      if (value === true) {
        util.removeSymbolicDependencies(path, 'Unable to remove the file. Do you have permissions to access this file?: ');
      }
    });

  await util.doesFileExistAsync(path + '.cmd')
    .then((value: boolean) => {
      if (value === true) {
        util.removeSymbolicDependencies(path + '.cmd', 'Unable to remove the file. Do you have permissions to access this file?: ');
      }
    });

  return Promise.resolve();
}

generate();
