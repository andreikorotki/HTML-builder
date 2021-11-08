const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');


let dir = __dirname;
let secretDir = path.join(dir, 'secret-folder');

async function getFiles() {
    try {
    const files =  await fs.promises.readdir(secretDir, {withFileTypes: true});
    for (const file of files) 
        if (file.isFile()) {
        //console.log(file);
        let parsedPath = path.parse(file.name);
        let stats = await fs.promises.stat(path.join(dir, 'secret-folder', file.name.toString()), (err, stats) => {
            return stats;
        });
        
        console.log(parsedPath.name + ' - ' + parsedPath.ext.substring(1) + ' - ' + stats.size + 'b');
        }
    } catch (err) {
    console.error(err);
    } 
}

getFiles();