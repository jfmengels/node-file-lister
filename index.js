var fs = require("fs");
var path = require("path");
var extend = require("extend");

function concatenator(callsRemaining, cb) {
    var items = [],
        returned = false;

    return function(error, newItems) {
        if (error) {
            if (!returned) {
                returned = true;
                return cb(error);
            }
        }
        if (newItems) {
            items = items.concat(newItems);
        }
        if (--callsRemaining === 0 && !returned) {
            returned = true;
            return cb(null, items);
        }
    };
}

function listFiles(dir, options, depth, cb) {
    fs.readdir(dir, function(error, list) {
        if (error) {
            return cb(error);
        }

        if (list.length === 0) {
            return cb(null, []);
        }
        var callback = concatenator(list.length, cb);

        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(error, stat) {
                if (error) {
                    return callback(error);
                }
                if (stat && stat.isDirectory()) {
                    if (options.maxDepth === depth) {
                        return callback();
                    }
                    listFiles(file, options, depth + 1, callback);
                } else if (stat && stat.isFile()) {
                    callback(null, [file]);
                }
            });
        });
    });
}

var defaultOptions = {
    maxDepth: -1
};

module.exports = function(dirs, options, cb) {
    if (!cb) {
        cb = options;
        options = {};
    }
    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }
    options = extend(options, defaultOptions);

    var concat = concatenator(dirs.length, cb);
    dirs.forEach(function(dir) {
        listFiles(dir, options, 0, concat);
    });
};