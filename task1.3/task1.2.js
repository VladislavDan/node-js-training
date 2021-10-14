import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';

const readStream = fs.createReadStream(path.join(__dirname) + '/input.csv');

const writeStream = fs.createWriteStream(
    path.join(__dirname) + '/output.txt',
    {
        flags: "w",
    }
);

readStream.pipe(csv()).pipe(writeStream);
