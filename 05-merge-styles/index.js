const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


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

async function readCssFile(sourcePath) {
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
        let data = await readCssFile(path.join(srcDir, cssFile.name));
        //console.log(data)
        cssContent.push(data);
      }
      return cssContent;
}

async function createBundleCss() {
    let dir = __dirname;
    let srcDir = path.join(dir, 'styles');
    let bundleFile = path.join(dir, 'project-dist', 'bundle.css');

    getCssFilesList(srcDir)
    .then(cssFiles  => fillCssArray(cssFiles, srcDir))
    .then(cssContent => writeToBundleFile(bundleFile, cssContent))
    .catch(() => {
        console.log('Error!');
    });
    // let cssFiles = await getCssFilesList(srcDir);
    // let cssContent = await fillCssArray(cssFiles, srcDir);
    // let bundleFile = path.join(dir, 'project-dist', 'bundle.css');
    // await writeToBundleFile(bundleFile, cssContent);
}

createBundleCss();