var EasyZip = require('./easy-zip').EasyZip;

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
zip6.zipFolder('../easy-zip2', {
    rootFolder: 'easy-zip6'
}, function() {
    zip6.writeToFile('folderall-changed-folder-name.zip');
});

// write data to http.Response
//zip.writeToResponse(response,'attachment.zip');

// write to file sync
//zip.writeToFileSycn(filePath);
