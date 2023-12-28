const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
mergeFolder(cwd, path.directory(cwd));

function mergeFolder(from, to, overwrite=false) {
	const items = fs.readdirSync(from, { withFileTypes: true });
	for (const item of items) {
		const item_path = path.resolve(item.path, item.name);
		const dest_path = path.resolve(to, item.name);
		if (item.isFile()) {
			fs.copyFileSync(item_path, dest_path,
				overwrite ? fs.constants.COPYFILE_FICLONE : fs.constants.COPYFILE_EXCL);
		} else if (item.isDirectory()) {
			mergeFolder(item_path, dest_path);
		} else {
			console.log('Not a file nor a directory:' + item_path);
		}
	}
}