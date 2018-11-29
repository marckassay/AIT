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
const customBashDependencyFileName = 'custom_dependency_symlink';
const customCmdDependencyFileName = 'custom_dependency_symlink.cmd';
const genericAdaptorFileName = 'adaptor.js';

/**
 * The location to the `out` folder. This is intended to reside at the project root directory.
 */
let outDirPath: string;

const scriptsGenericBashDependency: string = join(scriptsDependencyDirPath, genericBashDependencyFileName);
function outBashDependency(name: string = genericBashDependencyFileName): string {
  return join(outDirPath, name);
}

const scriptsGenericCmdDependency: string = join(scriptsDependencyDirPath, genericCmdDependencyFileName);
function outCmdDependency(name: string = genericCmdDependencyFileName): string {
  return join(outDirPath, name);
}

const scriptsGenericAdaptor: string = join(scriptsAdaptorDirPath, genericAdaptorFileName);
function outAdaptor(name: string = genericAdaptorFileName): string {
  return join(outDirPath, name);
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
    await newCommandDependency(dependency.name, dependency.symlinkPath, dependency.adaptor);
  }
}

/**
* Deletes if there is an existing link
*
* @param {string} name the filename of the bash or batch file.
* @param {string} commandDirectoryPath the directory of where the file will reside.
* @param {string} adaptor the JS file where the command resolves to. Defaults to `adaptor.js`.
*/
async function newCommandDependency(name: string, commandDirectoryPath: string, adaptor?: string) {
  let bashDependencyValue: string;
  let cmdDependencyValue: string;
  let adaptorValue: string;

  // resolve commandDirectoryPath if its in a scriptblock (or partial scriptblock which must fail).
  if (commandDirectoryPath.startsWith('{') || commandDirectoryPath.endsWith('}')) {
    commandDirectoryPath = await util.executeScriptBlock(commandDirectoryPath, 'Unable to execute the following scriptblock: ');
  }

  const symbolicFilePath: string = join(commandDirectoryPath, name);
  await checkAndRemoveExisitingCommandFiles(symbolicFilePath);

  if (!adaptor) {
    await util.checkAndCreateACopy(scriptsGenericBashDependency, outBashDependency(), true);
    await util.checkAndCreateACopy(scriptsGenericCmdDependency, outCmdDependency());
    await util.checkAndCreateACopy(scriptsGenericAdaptor, outAdaptor());

    bashDependencyValue = outBashDependency();
    cmdDependencyValue = outCmdDependency();
  } else {
    bashDependencyValue = outBashDependency(name + '_dependency');
    cmdDependencyValue = outCmdDependency(name + '_dependency.cmd');
    adaptorValue = outAdaptor(util.getFullname(adaptor));
    const adaptorName = util.getFullname(adaptor);

    const scriptsCustomBashDependency: string = join(scriptsDependencyDirPath, customBashDependencyFileName);
    const scriptsCustomCmdDependency: string = join(scriptsDependencyDirPath, customCmdDependencyFileName);


    // if custom adaptor is defined; then a custom set of files are needed.
    await util.checkAndCreateACopy(scriptsCustomBashDependency, bashDependencyValue, true);
    await util.checkAndCreateACopy(scriptsCustomCmdDependency, cmdDependencyValue);
    await util.checkAndCreateACopy(adaptor, adaptorValue);

    // replace tokens inside the bash and batch files.
    // await util.replaceTokenInFile(bashDependencyValue, '{Outpath}', outDirPath);
    await util.replaceTokenInFile(cmdDependencyValue, '{Outpath}', outDirPath);
    // await util.replaceTokenInFile(bashDependencyValue, '{AdaptorPath}', adaptorName);
    await util.replaceTokenInFile(cmdDependencyValue, '{AdaptorPath}', adaptorName);
  }

  await util.createSymlink(bashDependencyValue, symbolicFilePath);
  await util.createSymlink(cmdDependencyValue, symbolicFilePath + '.cmd');
}

async function checkAndRemoveExisitingCommandFiles(path: string) {
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
