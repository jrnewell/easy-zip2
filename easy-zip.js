// a fork of easy-zip module
// https://github.com/owenchong/easy-zip (0.0.4)

var util = require('util'),
    async = require('async'),
    path = require('path'),
    buffer = require('buffer'),
    fs = require('graceful-fs'),
    JSZip = require('jszip');

function EasyZip() {
    JSZip.apply(this, arguments);
    this.clone = function() {
        var newObj = new EasyZip();
        for (var i in this) {
            if (typeof this[i] !== "function") {
                newObj[i] = this[i];
            }
        }
        return newObj;
    };
}

util.inherits(EasyZip, JSZip);

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

EasyZip.prototype.addFile = function(file, filePath, callback) {
    var datas = [],
        self = this,
        err = null,
        rs = fs.createReadStream(filePath);

    rs.on('data', function(data) {
        datas.push(data);
    });

    rs.on('error', function(_err) {
        err = _err;
        callback(err);
    });

    rs.on('end', function() {
        var buf = Buffer.concat(datas);
        self.file(file, toArrayBuffer(buf), {
            base64: false,
            binary: true
        });
        if (!err) callback();
    });
}

EasyZip.prototype.batchAdd = function(files, callback) {
    var self = this;
    async.each(files, function(item, callback) {
        var source = item.source,
            target = item.target,
            appender = self,
            folder = item.folder,
            fileName = path.basename(target),
            dirname = path.dirname(target);

        if (dirname != '.') {
            appender = self.folder(dirname);
        }

        if (source != null && source.trim() != '') {
            appender.addFile(fileName, source, callback);
        } else {
            // if no source, make the target as folder
            self.folder(target);
            callback();
        }

    }, function(err) {
        callback(err, self);
    });
}


EasyZip.prototype.zipFolder = function(folder, opts, callback) {
    var self = this;
    var hidden = false;
    var filter = null;
    var rootFolder = path.basename(folder);

    function removeHidden(files) {
      return files.filter(function(file){
        return '.' != file[0];
      });
    }

    // assume that is opts is a funciton, it is the callback method
    if (typeof opts === 'object') {
        hidden = (typeof opts.hidden !== 'undefined' ? opts.hidden : hidden);
        filter = (typeof opts.filter !== 'undefined' ? opts.filter : filter);
        rootFolder = (typeof opts.rootFolder !== 'undefined' ? opts.rootFolder : rootFolder);
    }
    else if (typeof opts === 'function') {
        callback = opts;
    }

    fs.exists(folder, function(exists) {
        if (!exists) return callback(new Error('Folder not found'), self);

        fs.readdir(folder, function(err, files) {
            if (err) return callback(err, self);

            if (!hidden) files = removeHidden(files);
            if (filter) files = files.filter(filter);

            var zips = [];

            async.whilst(
                function() { return files.length > 0 },

                function(callback) {
                    var file = files.shift();
                    var sourcePath = path.join(folder, file);
                    var targetPath = path.join(rootFolder, file);
                    fs.stat(sourcePath, function(err, stats) {
                        if (err) return callback(err);

                        if (stats.isFile()) {
                            zips.push({
                                target: targetPath,
                                source: sourcePath
                            });
                            callback();
                        } else if (stats.isDirectory()) {
                            zips.push({
                                target: targetPath
                            });

                            // join the path
                            fs.readdir(sourcePath, function(err, subFiles) {
                                if (err) return callback(err);

                                for(i = 0; i < subFiles.length; i++) {
                                    files.push(path.join(file, subFiles[i]));
                                }
                                callback();
                            });
                        }
                    });
                },

                function(err) {
                    if (err) return callback(err);

                    self.batchAdd(zips, function(err) {
                        callback(err, self)
                    });
                }
            );
        });
    });
}

EasyZip.prototype.writeToResponse = function(response, attachmentName) {
    attachmentName = attachmentName || new Date().getTime();
    attachmentName += '.zip';
    response.setHeader('Content-Disposition', 'attachment; filename="' + attachmentName + '"');
    response.write(this.generate({
        base64: false,
        compression: 'DEFLATE'
    }), "binary");
    response.end();
}

EasyZip.prototype.writeToFile = function(filePath, callback) {
    var data = this.generate({
        base64: false,
        compression: 'DEFLATE'
    });
    fs.writeFile(filePath, data, 'binary', callback);
}

EasyZip.prototype.writeToFileSync = function(filePath) {
    var data = this.generate({
        base64: false,
        compression: 'DEFLATE'
    });
    fs.writeFileSync(filePath, data, 'binary');
}

exports.EasyZip = EasyZip;
