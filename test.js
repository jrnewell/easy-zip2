var EasyZip = require('./easy-zip').EasyZip;

var makeCallback = function(fileName) {
    return function() {
        console.log('finished creating zip file ' + fileName);
    }
}

var writeToZip = function(zip, fileName) {
    zip.writeToFile(fileName, makeCallback(fileName));
}

// add text
console.log("add text");
var zip = new EasyZip();
zip.file('hello.txt', 'Hello World！');
writeToZip(zip, 'text.zip'); //write zip data to disk

// add folder
console.log("add folder");
var zip2 = new EasyZip();
var jsFolder = zip2.folder('js');
jsFolder.file('hello.js', 'alert("hello world")');
writeToZip(zip2, 'folder.zip');

// add file
console.log("add file");
var zip3 = new EasyZip();
zip3.addFile('main.js', 'easy-zip.js', function() {
    writeToZip(zip3, 'file.zip');
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
    writeToZip(zip4, 'batchadd.zip');
});

// zip a folder
console.log("zip a folder");
var zip5 = new EasyZip();
zip5.zipFolder('../easy-zip2', function() {
    writeToZip(zip5, 'folderall.zip');
});

// zip a folder and change folder destination name
console.log("zip a folder and change folder destination name");
var zip6 = new EasyZip();
zip6.zipFolder('../easy-zip2', {
    rootFolder: 'easy-zip6'
}, function() {
    writeToZip(zip6, 'folderall-changed-folder-name.zip');
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
    }, makeCallback('stream.zip'));
});

// write data to http.Response
//zip.writeToResponse(response,'attachment.zip');

