import fs from "fs";
import uglify from "uglify-js";

var data = {};
readFiles('../assets/components/', function(filename, content) {
	if (filename.endsWith("min.js")) return;
	console.log("filename", filename);
	createFile('../assets/components/' + filename.split(".")[0] + ".min.js", uglify.minify(content).code);
	
}, function(err) {
	throw err;
});

function readFiles(dirname, onFileContent, onError) {
	fs.readdir(dirname, function(err, filenames) {
		if (err) {
			onError(err);
			return;
		}
		filenames.forEach(function(filename) {
			fs.readFile(dirname + filename, 'utf-8', function(err, content) {
				if (err) {
					onError(err);
					return;
				}
				onFileContent(filename, content);
			});
		});
	});
}

function createFile(filename, content) {
	var parent = this;
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, content, function(err) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve();
			}
		});
	});
}