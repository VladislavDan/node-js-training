const process = require('process');

process.stdin.resume();

process.stdin.setEncoding('utf8');

process.stdin.on(
    'data',
    function (data) {
        var revertedString = data.split("").reverse().join("").substring(1, data.length);
        process.stdout.write(revertedString);
        process.stdout.write("\n");
        process.stdout.write("\n");
    }
);
