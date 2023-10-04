var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const process = require('process');
const minimist = require('minimist');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
// rest of your code
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = minimist(process.argv.slice(2));
        const token = args.token;
        if (!token) {
            return console.error('A token is needed. You can create one on https://web3.storage');
        }
        if (args._.length < 1) {
            return console.error('Please supply the path to a file or directory');
        }
        const storage = new Web3Storage({ token });
        const files = [];
        for (const path of args._) {
            const pathFiles = yield getFilesFromPath(path);
            files.push(...pathFiles);
        }
        console.log(`Uploading ${files.length} files`);
        const cid = yield storage.put(files);
        console.log('Content added with CID:', cid);
    });
}
main();
//# sourceMappingURL=ipfs.js.map