const fs = require('fs');
const path = require('path');

let dir = __dirname;
let filepath = path.join(dir, 'text.txt');
let  data = '';
let readStream = fs.createReadStream(filepath, 'utf8'); 

readStream.on('data',  function(chunk) {
    data += chunk;
}).on('end', function() {
    console.log(data);
});
