const fs = require('fs');
const path = require('path');
const readline = require("readline");

console.log('Hello!\nProvide your input:');
let dir = __dirname;
let filepath = path.join(dir, 'text.txt');

//create empty file
let writeStream = fs.createWriteStream(filepath, { overwrite: false });


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function exit() {
    rl.close();
}

rl.on('line', (input) => {
    if (input === 'exit') {
        exit();
    }
    else {
    writeStream.write(input, 'utf8');
    //console.log(`Received: ${input}`);
    }

  });


rl.on("close", function() {
    console.log("\nBYE! HAVE A GOOD DAY!");
    process.exit(0);
});