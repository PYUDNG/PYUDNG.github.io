const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
mergeFolder(cwd, path.dirname(cwd), true);

function mergeFolder(from, to, overwrite=false) {
	console.log(`Merging directory ${from} to ${to}`);
	try { fs.accessSync(to, fs.constants.F_OK) } catch(e) { fs.mkdirSync(to); }

	const items = fs.readdirSync(from, { withFileTypes: true });
	for (const item of items) {
		const item_path = path.resolve(item.path, item.name);
		const dest_path = path.resolve(to, item.name);
		console.log([item, item_path, dest_path]);
		if (item.isFile()) {
			console.log(`Copying file ${item_path} to ${dest_path}`);
			try {
				fs.accessSync(dest_path, fs.constants.F_OK);
				overwrite && fs.unlinkSync(dest_path);
			} catch(e) {}
			fs.copyFileSync(item_path, dest_path,
				overwrite ? fs.constants.COPYFILE_FICLONE : fs.constants.COPYFILE_EXCL);
		} else if (item.isDirectory()) {
			mergeFolder(item_path, dest_path);
		} else {
			console.log('Not a file nor a directory:' + item_path);
		}
	}
}