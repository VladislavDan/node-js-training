"use strict";

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var readStream = _fs["default"].createReadStream(_path["default"].join(__dirname) + '/input.csv');

var writeStream = _fs["default"].createWriteStream(_path["default"].join(__dirname) + '/output.txt', {
  flags: "w"
});

readStream.pipe((0, _csvtojson["default"])()).pipe(writeStream);