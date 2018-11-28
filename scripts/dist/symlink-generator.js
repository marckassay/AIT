"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./symlink-util");
var path_1 = require("path");
/**
 * Relative path from project contains `genericBashDependencyFileName` and `genericCmdDependencyFileName`.
 */
var scriptsDependencyDirPath = './scripts/symlink/dependency';
/**
 * Relative path from project that contains `genericAdaptorFileName`.
 */
var scriptsAdaptorDirPath = './scripts/dist/adaptor';
var genericBashDependencyFileName = 'dependency_symlink';
var genericCmdDependencyFileName = 'dependency_symlink.cmd';
var customBashDependencyFileName = 'custom_dependency_symlink';
var customCmdDependencyFileName = 'custom_dependency_symlink.cmd';
var genericAdaptorFileName = 'adaptor.js';
/**
 * The location to the `out` folder. This is intended to reside at the project root directory.
 */
var outDirPath;
var scriptsGenericBashDependency = path_1.join(scriptsDependencyDirPath, genericBashDependencyFileName);
function outBashDependency(name) {
    if (name === void 0) { name = genericBashDependencyFileName; }
    return path_1.join(outDirPath, name);
}
var scriptsGenericCmdDependency = path_1.join(scriptsDependencyDirPath, genericCmdDependencyFileName);
function outCmdDependency(name) {
    if (name === void 0) { name = genericCmdDependencyFileName; }
    return path_1.join(outDirPath, name);
}
var scriptsGenericAdaptor = path_1.join(scriptsAdaptorDirPath, genericAdaptorFileName);
function outAdaptor(name) {
    if (name === void 0) { name = genericAdaptorFileName; }
    return path_1.join(outDirPath, name);
}
var configFilename = 'symlink.config.json';
/**
 * Reads the `symlink-config.json` by iterating the dependencies section of the file to create
 * symlinks. These symlinks are intended to reside in a location listed in the env's PATH so that
 * the CLI, IDE, node and/or any executable will find it "globally" but since symbolic will call the
 * local package. If called outside of project's directory will command will fail and if called in
 * another project with same symbolic links, it will seek for the package(s) for that project.
 *
 * This is developed to work on POSIX and Windows.
 */
function generate() {
    return __awaiter(this, void 0, void 0, function () {
        var config, configRaw, _i, _a, dependency;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, util.doesFileExistAsync(configFilename, 'Unable to load symlink.config.json')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, util.readFileAsync(configFilename, 'Unable to read symlink.config.json')];
                case 2:
                    configRaw = _b.sent();
                    try {
                        config = JSON.parse(configRaw);
                        outDirPath = config.projectOutPath;
                    }
                    catch (error) {
                        throw new Error('Unable to parse symlink.config.json into a JSON object.');
                    }
                    _i = 0, _a = config.dependencies;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    dependency = _a[_i];
                    return [4 /*yield*/, newCommandDependency(dependency.name, dependency.symlinkPath, dependency.adaptor)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
* Deletes if there is an existing link
*
* @param {string} name the filename of the bash or batch file.
* @param {string} commandDirectoryPath the directory of where the file will reside.
* @param {string} adaptor the JS file where the command resolves to. Defaults to `adaptor.js`.
*/
function newCommandDependency(name, commandDirectoryPath, adaptor) {
    return __awaiter(this, void 0, void 0, function () {
        var bashDependencyValue, cmdDependencyValue, adaptorValue, symbolicFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(commandDirectoryPath.startsWith('{') || commandDirectoryPath.endsWith('}'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, util.executeScriptBlock(commandDirectoryPath, 'Unable to execute the following scriptblock: ')];
                case 1:
                    commandDirectoryPath = _a.sent();
                    _a.label = 2;
                case 2:
                    symbolicFilePath = path_1.join(commandDirectoryPath, name);
                    return [4 /*yield*/, checkAndRemoveExisitingCommandFiles(symbolicFilePath)];
                case 3:
                    _a.sent();
                    if (!!adaptor) return [3 /*break*/, 7];
                    return [4 /*yield*/, util.checkAndCreateACopy(scriptsGenericBashDependency, outBashDependency(), true)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, util.checkAndCreateACopy(scriptsGenericCmdDependency, outCmdDependency())];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, util.checkAndCreateACopy(scriptsGenericAdaptor, outAdaptor())];
                case 6:
                    _a.sent();
                    bashDependencyValue = outBashDependency();
                    cmdDependencyValue = outCmdDependency();
                    return [3 /*break*/, 11];
                case 7:
                    bashDependencyValue = outBashDependency(name + '_');
                    cmdDependencyValue = outCmdDependency(name + '_');
                    adaptorValue = outAdaptor(util.getFullname(adaptor));
                    // if custom adaptor is defined; then a custom set of files are needed.
                    return [4 /*yield*/, util.checkAndCreateACopy(customBashDependencyFileName, bashDependencyValue, true)];
                case 8:
                    // if custom adaptor is defined; then a custom set of files are needed.
                    _a.sent();
                    return [4 /*yield*/, util.checkAndCreateACopy(customCmdDependencyFileName, cmdDependencyValue)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, util.checkAndCreateACopy(adaptor, adaptorValue)];
                case 10:
                    _a.sent();
                    // TODO: overwrite bashDependencyValue and cmdDependencyValue files to have in simply call its custom adaptor
                    util.replaceTokenInFile(bashDependencyValue, '{Outpath}', outDirPath);
                    util.replaceTokenInFile(cmdDependencyValue, '{Outpath}', outDirPath);
                    util.replaceTokenInFile(bashDependencyValue, '{AdaptorPath}', adaptorValue);
                    util.replaceTokenInFile(cmdDependencyValue, '{AdaptorPath}', adaptorValue);
                    _a.label = 11;
                case 11: return [4 /*yield*/, util.createSymlink(bashDependencyValue, symbolicFilePath)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, util.createSymlink(cmdDependencyValue, symbolicFilePath + '.cmd')];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkAndRemoveExisitingCommandFiles(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util.doesFileExistAsync(path)
                        .then(function (value) {
                        if (value === true) {
                            util.removeSymbolicDependencies(path, 'Unable to remove the file. Do you have permissions to access this file?: ');
                        }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, util.doesFileExistAsync(path + '.cmd')
                            .then(function (value) {
                            if (value === true) {
                                util.removeSymbolicDependencies(path + '.cmd', 'Unable to remove the file. Do you have permissions to access this file?: ');
                            }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, Promise.resolve()];
            }
        });
    });
}
generate();
//# sourceMappingURL=symlink-generator.js.map