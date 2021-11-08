
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


let dir = __dirname;


async function getFilesList(srcDir) {
    try {
        const files =  await fs.promises.readdir(srcDir, {withFileTypes: true});
        return files;
    }
    catch (err) {
        console.error(err);
    } 
    
}

async function createDirectory(newDirPath) {
let isCreated = await fsPromises.mkdir(newDirPath, { recursive: true }, (err) => {
    if (err) {
        return 0;
    }
    return 1;
  });
  return isCreated;
}

async function removeDirectory(newDirPath) {
    let isRemoved = await fsPromises.rmdir(newDirPath, { recursive: true }, (err) => {
        if (err) {
            return 0;
        }
        return 1;
      });
      return isRemoved;
    }

async function copyFile(src, dest) {
try {
    await fsPromises.copyFile(src, dest);
    console.log(`${src} was copied to ${dest}`);
  } catch {
    console.log(`The file ${src} could not be copied`);
  }
}

async function copyDirectory() {
    let srcDir = path.join(dir,'files');
    let files = await  getFilesList(srcDir);
    //console.log(files);
    let newDirName = 'files-copy';
    let newDirPath = path.join(dir, newDirName);
    await removeDirectory(newDirPath);
    let isCreated = await createDirectory(newDirPath);
    for(const file of files) {
    await copyFile(path.join(srcDir, file.name), path.join(newDirPath, file.name));
    }
    
}

copyDirectory();

