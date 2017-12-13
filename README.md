easy-zip2
=========

A fork of npm module [easy-zip](https://github.com/owenchong/easy-zip)

* Uses nodebuffer instead of base64 to get better speed
* JSZip version 3.1.3
* Supports zip streams for handdling big zip files.

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
    }, // if source is null, means make a folder
    {
        source: 'jszip.js',
        target: 'lib/tmp.js'
    }  // ignore missing source files
];
var zip4 = new EasyZip();
zip4.batchAdd(files, {
    ignore_missing: true
}, function() {
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
zip6.zipFolder('../easy-zip2', {
    rootFolder: 'easy-zip6'
}, function() {
    zip6.writeToFile('folderall.zip');
});


// zip with Stream
// use for zip a lot files or big file
console.log("zip with Stream");
var zip7 = new EasyZip();
var files = [{
        source: 'easy-zip.js',
        target: 'files-1.js'
    },{
        source: 'easy-zip.js',
        target: 'files-2.js'
    },{
        source: 'easy-zip.js',
        target: 'files-3.js'
    },{
        source: 'easy-zip.js',
        target: 'files-4.js'
    },{
        source: 'easy-zip.js',
        target: 'files-5.js'
    }
];
zip7.batchAdd(files, function() {
    zip7.writeToFileStream('stream.zip', function(metadata) {
        console.log(metadata);
    }, function() {
        console.log("stream.zip is finished");
    });
});

// write data to http.Response
//zip.writeToResponse(response,'attachment.zip');

```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
