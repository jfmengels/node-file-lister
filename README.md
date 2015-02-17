# file-lister

Simple file listing in directories using Node.js.

# example

```js
var listFiles = require('file-lister');

listFiles(["folder1", "/my/favorite/folder/"], function(error, files) {
    if (error) {
        console.log(error);
    } else {
        console.log(files.join("\n"));
    }
});
```

which outputs
```
/absolute/path/to/folder1/file1
/absolute/path/to/folder1/file2
/absolute/path/to/folder1/another/folder/file3
/my/favorite/folder/file4
/my/favorite/folder/file5
```

# methods

## listFiles(dirs, options, cb)

List all the files recursively in dirs.

`dirs` can be a string or an array of strings. They will each be used as arguments of [fs.readdir](http://nodejs.org/api/fs.html#fs_fs_readdir_path_callback), so read its documentation if needed.

Either `cb(error)` will be called if an error occurs at any time in the process, or `cb(null, files)` with files being an array of files as strings. Only files are listed, no directories.

`options` is optional, but allows for more configuration.
`options.maxDepth` will make the lister stop after `options.maxDepth` recursions.

# install

Using [npm](http://npmjs.org):

```
npm install file-lister
```