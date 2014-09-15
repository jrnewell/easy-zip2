easy-zip2
=========

A fork of npm module [easy-zip](https://github.com/owenchong/easy-zip)

## Installation

```shell
npm install --save easy-zip2
```

## Examples

```js
var EasyZip = require('easy-zip2').EasyZip;

// add text
console.log("add text");
var zip = new EasyZip();
zip.file('hello.txt', 'Hello World！');
zip.writeToFile('text.zip'); //write zip data to disk

// add folder
console.log("add folder");
var zip2 = new EasyZip();
var jsFolder = zip2.folder('js');
jsFolder.file('hello.js', 'alert("hello world")');
zip2.writeToFile('folder.zip');

// add file
console.log("add file");
var zip3 = new EasyZip();
zip3.addFile('main.js', 'easy-zip.js', function() {
    zip3.writeToFile('file.zip');
});

// batch add files
console.log("batch add files");
var files = [{
        source: 'easy-zip.js',
        target: 'easy-zip.js'
    }, {
        target: 'img'
    }, //if source is null,means make a folder
    {
        source: 'jszip.js',
        target: 'lib/tmp.js'
    }
];
var zip4 = new EasyZip();
zip4.batchAdd(files, function() {
    zip4.writeToFile('batchadd.zip');
});

// zip a folder
console.log("zip a folder");
var zip5 = new EasyZip();
zip5.zipFolder('../easy-zip2', function() {
    zip5.writeToFile('folderall.zip');
});

// zip a folder and change folder destination name
console.log("zip a folder and change folder destination name");
var zip6 = new EasyZip();
zip6.zipFolder('../easy-zip2', function() {
    zip6.writeToFile('folderall.zip');
}, {
    rootFolder: 'easy-zip6'
});

// write data to http.Response
//zip.writeToResponse(response,'attachment.zip');

// write to file sync
//zip.writeToFileSycn(filePath);
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
