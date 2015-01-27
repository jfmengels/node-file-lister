var fs = require("fs");
var path = require("path");
// var extend = require("node.extend");
// TODO remove tmp extend
var extend = function(config, defaultConfig) {
    for (var i in defaultConfig) {
        if (config[i] === undefined) {
            config[i] = defaultConfig[i];
        }
    }
    return config;
};

function concatenator(callsRemaining, cb) {
    var items = [];
    var returned = false;
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

function listFiles(dir, settings, depth, cb) {
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
                    if (settings.maxDepth === depth) {
                        return callback();
                    }
                    listFiles(file, settings, depth + 1, callback);
                } else if (stat && stat.isFile()) {
                    callback(null, [file]);
                }
            });
        });
    });
}

var lister = {};

var defaultSettings = {
    maxDepth: -1
};

lister.listFiles = function(dirs, settings, cb) {
    if (!cb) {
        cb = settings;
        settings = {};
    }
    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }
    settings = extend(settings, defaultSettings);

    var concat = concatenator(dirs.length, cb);
    dirs.forEach(function(dir) {
        listFiles(dir, settings, 0, concat);
    });
};

module.exports = lister;