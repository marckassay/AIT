interface SymlinkConfig {
  projectOutPath: string;
  dependencies: [{
    name: string,
    symlinkPath: string,
    adaptor?: string
  }];
}


const scriptsDependencyDirPath = './scripts/symlink/dependency';
const scriptsAdaptorDirPath = './scripts/dist/adaptor';
const genericBashDependencyFileName = 'dependency_symlink';
const genericCmdDependencyFileName = 'dependency_symlink.cmd';
const genericAdaptorFileName = 'adaptor.js';


/**
 * Reads the `symlink-config.json` by iterating the dependencies section of the file to create
 * symlinks. These symlinks are intended to reside in a location listed in the env's PATH so that
 * the CLI, IDE, node and/or any executable will find it "globally" but since symbolic will call the
 * local package. If called outside of project's directory will command will fail and if called in
 * another project with same symbolic links, it will seek for the package(s) for that project.
 *
 * This is developed to work on POSIX and Windows.
 */
export class SymlinkGenerator {
  outDirPath: string;

  config: SymlinkConfig;

  constructor(public configFilename: string = 'symlink.config.json') { }

  generate() {
    return readFileAsync(this.configFilename)
      .then((json) => {
        return Promise.resolve(JSON.parse(json.toString()));
      })
      .then((config: SymlinkConfig) => {
        this.config = config;
        this.outDirPath = this.config.projectOutPath;

        return prepareDefaultsToOutPathDir(config.projectOutPath);
      })
      .then(() => {
        const iterateDependencies = async () => {
          for (const dependency of this.config.dependencies) {
            await this.newSymlinkFile(dependency.name, dependency.symlinkPath, dependency.adaptor);
          }
          return Promise.resolve();
        };
        return iterateDependencies();
      });
  }

  /**
  * Deletes if there is an existing link
  *
  * @param {string} linkFilename the filename of the symbolic link file.
  * @param {string} linkDirectoryPath the directory of where the symbolic link file will reside.
  * @param {string} linkValueDirectoryPath the directory where the exisitng file is for the symbolic
  * link. Defaults to the value of `projectOutPath` that is set in `symlink.config.json` file
  * @param {string} adaptor the JS file where the symbolic links resolves to. Defaults to `symlink-dependency.js`.
  */
  async newSymlinkFile(linkFilename: string, linkDirectoryPath: string, adaptor?: string) {

    // resolve linkDirectoryPath if its in a scriptblock...
    if (linkDirectoryPath.startsWith('{') || linkDirectoryPath.endsWith('}')) {
      linkDirectoryPath = await executeScriptBlock(linkDirectoryPath);
    }

    const commandPath = join(linkDirectoryPath, linkFilename);

    let linkValueBashFilePath;
    let linkValueCmdFilePath;

    return doesFileExistAsync(commandPath)
      .then((value: boolean) => {

        if (value === true) {
          fs.unlinkSync(commandPath);
        }

        if (adaptor === undefined) {
          linkValueBashFilePath = join(this.config.projectOutPath, genericBashDependencyFileName);
          linkValueCmdFilePath = join(this.config.projectOutPath, genericCmdDependencyFileName);

          fs.symlinkSync(linkValueBashFilePath, commandPath, 'file');
          fs.symlinkSync(linkValueCmdFilePath, commandPath, 'file');
        } else {
          linkValueBashFilePath = join(this.config.projectOutPath, 'symbolic-' + linkFilename + '-dependency');
          linkValueCmdFilePath = join(this.config.projectOutPath, 'symbolic-' + linkFilename + '-dependency.cmd');

          // copy bash and cmd and rename file as unique
          fs.copyFileSync(join(scriptsDependencyDirPath, genericBashDependencyFileName), linkValueBashFilePath);
          fs.copyFileSync(join(scriptsDependencyDirPath, genericCmdDependencyFileName), linkValueCmdFilePath);

          makeFileExecutable(linkValueBashFilePath);
          makeFileExecutable(linkValueCmdFilePath);

          // copy adaptor pathandfile into linkValueDirectoryPath
          copyFile2(adaptor, this.config.projectOutPath);

          // replace 'adaptor=...' in cmd and bash
          const adaptorFileName = basename(adaptor);
          replaceAdaptorValueInFile(linkValueBashFilePath, adaptorFileName);
          replaceAdaptorValueInFile(linkValueCmdFilePath, adaptorFileName);
        }
        return Promise.resolve();
      });
  }

  prepareDefaultsToOutPathDir(directoryPath) {
    if (fs.existsSync(directoryPath) === false) {
      // this requires Node version 10.12.x
      fs.mkdirSync(directoryPath, { recursive: true });
      copyFile(genericAdaptorFileName, scriptsAdaptorDirPath, directoryPath);
      copyFileAndMakeExecutable(directoryPath, genericBashDependencyFileName);
      copyFileAndMakeExecutable(directoryPath, genericCmdDependencyFileName);
    } else {
      if (fs.existsSync(join(scriptsAdaptorDirPath, genericAdaptorFileName)) === false) {
        copyFile(genericAdaptorFileName, scriptsAdaptorDirPath, directoryPath);
      }
      if (fs.existsSync(join(directoryPath, genericBashDependencyFileName)) === false) {
        copyFileAndMakeExecutable(directoryPath, genericBashDependencyFileName);
      }
      if (fs.existsSync(join(directoryPath, genericCmdDependencyFileName)) === false) {
        copyFileAndMakeExecutable(directoryPath, genericCmdDependencyFileName);
      }
    }
  }
}
