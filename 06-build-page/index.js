
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const readline = require('readline');

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

async function copyDir(src, dest) {
    try{
        await fs.mkdir(dest, { recursive: true}, (err) => {
            if (err) {
                return 0;
            }
            return 1;
          });
          const dirEntries = await  getFilesList(src);
          console.log(dirEntries)
        for (const entity of dirEntries) {
            let srcPath = path.join(src, entity.name);
            let destPath = path.join(dest, entity.name);

            entity.isDirectory() ?
                await copyDir(srcPath, destPath) :
                await copyFile(srcPath, destPath);
        }
    }
    catch (err) {
        console.error(err);
        } 
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
    let srcDir = path.join(dir,'assets');
    let files = await  getFilesList(srcDir);
    let newDirName = 'project-dist';
    let newDirPath = path.join(dir, newDirName);
    let isCreated = await createDirectory(newDirPath);
    for (let entity of files) {
        let srcPath = path.join(srcDir,  entity.name);
        let destPath = path.join(newDirPath, 'assets', entity.name);

        entity.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await copyFile(srcPath, destPath);
    }
    
    
}



async function getCssFilesList(srcDir) {
    try {
        const files =  await fs.promises.readdir(srcDir, {withFileTypes: true});
        let cssFiles = [];
        for (const file of files) {
            if (file.isFile()) {
                let parsedPath = path.parse(file.name);
                if (parsedPath.ext === '.css') {
                    cssFiles.push(file);
                }
            }
        }
        return cssFiles;
    }
    catch (err) {
        console.error(err);
    } 
}

async function readFile(sourcePath) {
    return new Promise((resolve,reject) => {
        let data = '';
        let readStream = fs.createReadStream(sourcePath, 'utf8'); 
        readStream.on('data',  chunk => {
            data += chunk;
        })
        readStream.on('error', e => {
            reject(e);
        });
        return readStream.on('end', function() {
            //console.log(data);
            resolve(data);
        });
    });
}

async function writeToBundleFile(filepath, dataArray) { 
    let writeStream = fs.createWriteStream(filepath, { overwrite: false }, (err) => {
    console.log(err);
    });
    for (let i = 0; i < dataArray.length; i++) {
        writeStream.write(dataArray[i], 'utf8');
    }
}

async function fillCssArray(cssFiles, srcDir) {
    
    let cssContent = [];
    for (const cssFile of cssFiles) {
        let data = await readFile(path.join(srcDir, cssFile.name));
        //console.log(data)
        cssContent.push(data);
      }
      return cssContent;
}

async function createBundleCss() {
    let dir = __dirname;
    let srcDir = path.join(dir, 'styles');
    let bundleFile = path.join(dir, 'project-dist', 'style.css');

    getCssFilesList(srcDir)
    .then(cssFiles  => fillCssArray(cssFiles, srcDir))
    .then(cssContent => writeToBundleFile(bundleFile, cssContent))
    .catch(() => {
        console.log('Error!');
    });
}


async function getHtmlComponents(srcDir) {
    try {
        const files =  await fs.promises.readdir(srcDir, {withFileTypes: true});
        let htmlFiles = [];
        for (const file of files) {
            if (file.isFile()) {
                let parsedPath = path.parse(file.name);
                if (parsedPath.ext === '.html') {
                    let htmlContent = await readFile(path.join(srcDir, file.name));
                    htmlFiles.push({"file": file, "name": parsedPath.name, "content": htmlContent});
                }
            }
        }
        return htmlFiles;
    }
    catch (err) {
        console.error(err);
    } 
}



async function buildHtml() {
    let htmlComponents = await getHtmlComponents(path.join(dir, 'components'));
    let readStream = fs.createReadStream(path.join(dir, 'template.html'), 'utf8'); 
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      });
    let writeStream = fs.createWriteStream(path.join(dir, 'project-dist', 'index.html'), { overwrite: false }, (err) => {
        console.log(err);
        });
    for await (let line of rl) {
        htmlComponents.forEach(element => {
            if (line.includes('{{' + element.name + '}}')) {
                //console.log(`Tag ${element.name} detected, write component content.`);
                line = line.replace('{{' + element.name + '}}', element.content);
            }
        });
        writeStream.write(line, 'utf8');

    }
}
buildHtml();
//createBundleCss();
//copyDirectory();

