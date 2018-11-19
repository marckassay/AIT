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
var child = require("child_process");
var fs = require("fs");
var util_1 = require("util");
var path = require("path");
function readFileAsync(filePath, err_message) {
    return __awaiter(this, void 0, void 0, function () {
        var readFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readFile = util_1.promisify(fs.readFile);
                    return [4 /*yield*/, readFile(filePath, 'utf8')
                            .then(function (value) {
                            if (value.length !== 0) {
                                return Promise.resolve(value);
                            }
                            else {
                                console.error(err_message);
                                process.exit(1002);
                            }
                        })
                            .catch(function () {
                            console.error(err_message);
                            process.exit(1002);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.readFileAsync = readFileAsync;
function doesFileExistAsync(filePath, err_message) {
    return __awaiter(this, void 0, void 0, function () {
        var doesFileExist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    doesFileExist = util_1.promisify(fs.exists);
                    return [4 /*yield*/, doesFileExist(filePath)
                            .then(function (value) {
                            if (value === false && err_message) {
                                console.error(err_message);
                                process.exit(1001);
                            }
                            else {
                                return value;
                            }
                        })
                            .catch(function () {
                            console.error(err_message);
                            process.exit(1001);
                            return false; // superfluous, but linter wants it.
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.doesFileExistAsync = doesFileExistAsync;
function executeScriptBlock(scriptblock, err_message) {
    return __awaiter(this, void 0, void 0, function () {
        var command, execute;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = scriptblock.replace(/[\{\}]/g, '');
                    execute = util_1.promisify(child.exec);
                    return [4 /*yield*/, execute(command)
                            .then(function (value) {
                            if (value.stderr) {
                                console.error(err_message + scriptblock);
                                process.exit(1003);
                            }
                            else {
                                return value.stdout.replace(/[\"\']/g, '').trimRight();
                            }
                        })
                            .catch(function () {
                            console.error(err_message + scriptblock);
                            process.exit(1003);
                            return '1003'; // superfluous, but linter wants it.
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.executeScriptBlock = executeScriptBlock;
function removeSymbolicDependencies(filePath, err_message) {
    return __awaiter(this, void 0, void 0, function () {
        var remove;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    remove = util_1.promisify(fs.unlink);
                    // tslint:disable-next-line:no-bitwise
                    if (!checkUsersPermissions(filePath, fs.constants.W_OK | fs.constants.R_OK)) {
                        console.error(err_message + filePath);
                        process.exit(1004);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, remove(filePath).catch(function () {
                            console.error('Although permissions to remove file is correct, failure occurred.' +
                                ' Is there another process accessing this file?: ' + filePath);
                            process.exit(1004);
                            return;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.removeSymbolicDependencies = removeSymbolicDependencies;
/**
 * Checks the destination for exisitence, if not existent it will create a copy from source.
 */
function checkAndCreateACopy(source, destination, asExecutable) {
    if (asExecutable === void 0) { asExecutable = true; }
    return __awaiter(this, void 0, void 0, function () {
        var copy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    copy = util_1.promisify(fs.copyFile);
                    return [4 /*yield*/, doesFileExistAsync(destination)
                            .then(function (value) {
                            if (value === false) {
                                // node.js ^10.12.0 is at least needed for mkdirSync's recursive option.
                                var destinationDirectoryPath = path.dirname(destination);
                                fs.mkdirSync(destinationDirectoryPath, { recursive: true });
                                return copy(source, destination)
                                    .then(function () {
                                    if (asExecutable) {
                                        return makeFileExecutable(destination);
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                });
                            }
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.checkAndCreateACopy = checkAndCreateACopy;
function createSymlink(filePath, linkPath) {
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
exports.createSymlink = createSymlink;
function checkUsersPermissions(filePath, mode) {
    try {
        fs.accessSync(filePath, mode);
        return true;
    }
    catch (err) {
        return false;
    }
}
function makeFileExecutable(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var changeMode;
        return __generator(this, function (_a) {
            changeMode = util_1.promisify(fs.chmod);
            // octal '0111' is expressed as: 'a+x'
            return [2 /*return*/, changeMode(filePath, '0111')
                    .then(function () {
                    return Promise.resolve();
                }, function () {
                    console.error('Unable to make the following file executable for POSIX environments: ' + filePath);
                    process.exit(1006);
                    return;
                })
                    .catch(function () {
                    console.error('Unable to make the following file executable for POSIX environments: ' + filePath);
                    process.exit(1006);
                    return;
                })];
        });
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
//# sourceMappingURL=symlink-util.js.map