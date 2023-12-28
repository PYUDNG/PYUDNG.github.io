const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const excludes = [
	__filename,
	path.resolve(cwd, 'excludes'),
];
const debug_mode = true;

mergeFolder(cwd, path.dirname(cwd), excludes, true);

function mergeFolder(from, to, excludes, overwrite=false) {
	debug(`Merging directory ${from} to ${to}`);

	// Check target directory existence
	try {
		fs.accessSync(to, fs.constants.F_OK);
		debug(`Directory exists: ${to}`);
	} catch(e) {
		// If not exists, an error will be thrown
		// Make the missing directory
		fs.mkdirSync(to);
		debug(`Directory made: ${to}`);
	}

	const items = fs.readdirSync(from, { withFileTypes: true });
	for (const item of items) {
		const item_path = path.resolve(item.path, item.name);
		const dest_path = path.resolve(to, item.name);

		// Whether to exclude this item
		if (excludes.includes(item_path)) {
			debug(`Excluding item: ${item_path}`);
			continue;
		}
		debug([item, item_path, dest_path]);

		if (item.isFile()) {
			// Copy file
			debug(`Copying file ${item_path} to ${dest_path}`);

			// Overwrite
			try {
				fs.accessSync(dest_path, fs.constants.F_OK);
				if (overwrite) {
					debug(`Unlinking file: ${dest_path}`);
					fs.unlinkSync(dest_path);
				}
			} catch(e) {}

			// Copy
			fs.copyFileSync(item_path, dest_path,
				overwrite ? fs.constants.COPYFILE_FICLONE : fs.constants.COPYFILE_EXCL);
		} else if (item.isDirectory()) {
			// Recursively walk through all child directories
			mergeFolder(item_path, dest_path, excludes, overwrite);
		} else {
			// Only deal with files and directories
			debug('Not a file nor a directory:' + item_path);
		}
	}
}

function debug(...args) {
	if (!debug_mode) { return; }

	!debug.count && (debug.count = 0);
	debug.count++;

	console.log(`[[ Debug Output ${debug.count} ]]`);
	console.log(...args);
	console.log();
}