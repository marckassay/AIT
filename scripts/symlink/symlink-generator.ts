import { newSymlinkFile, readFileAsync, prepareOutPathDir } from './symlink-util';

/**
 * Reads the `symlink-config.json` by iterating the dependencies section of the file to create
 * symlinks. These symlinks are intended to reside in a location listed in the env's PATH so that
 * the CLI, IDE, node and/or any executable will find it "globally" but since symbolic will call the
 * local package. If called outside of project's directory will command will fail and if called in
 * another project with same symbolic links, it will seek for the package(s) for that project.
 *
 * This is developed to work on POSIX and Windows.
 */
function symlinkGenerator() {
  return readFileAsync('symlink.config.json')
    .then((json) => {
      return Promise.resolve(JSON.parse(json.toString()));
    })
    .then((config) => {
      const iterateDependencies = async () => {

        prepareOutPathDir(config.projectOutPath);

        for (const dependency of config.dependencies) {
          await newSymlinkFile(dependency.name, dependency.symlinkPath, config.projectOutPath, dependency.adaptor);
        }
        return Promise.resolve();
      }
      return iterateDependencies();
    });
}

symlinkGenerator();
