var csv = require('csvtojson');
var fs = require('fs');
var path = require('path');

var readStream = fs.createReadStream(path.join(__dirname) + '/input.csv');

var writeStream = fs.createWriteStream(
    path.join(__dirname) + '/output.txt',
    {
        flags: "w",
    }
);

readStream.pipe(csv()).pipe(writeStream);
