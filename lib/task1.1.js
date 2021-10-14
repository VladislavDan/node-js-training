"use strict";

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_process["default"].stdin.resume();

_process["default"].stdin.setEncoding('utf8');

_process["default"].stdin.on('data', function (data) {
  var revertedString = data.split("").reverse().join("").substring(1, data.length);

  _process["default"].stdout.write(revertedString);

  _process["default"].stdout.write("\n");

  _process["default"].stdout.write("\n");
});