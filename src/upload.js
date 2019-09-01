const fs = require("fs");
const path = require("path");
const admzip = require('adm-zip');
const rimraf = require('rimraf');
const { exec } = require('child_process');

const { EXPORT_PATH } = require("./constants");

const _unpackBundle = async filename => {
	rimraf.sync(EXPORT_PATH);
	console.log(`\nUnpacking bundle to: \n${path.resolve(EXPORT_PATH)}`);
	const zip = new admzip(filename);
	zip.extractAllTo(EXPORT_PATH, true);
	fs.unlink(filename, () => null);
	console.log(`Bundle unpacked.`);
};

const _uploadBundle = async (metadata, app, deployment) => {
	return new Promise(resolve => {
		const { target_binary_range, description } = metadata;
		console.log(`\nUploading to ${app} ${deployment}...`);
		const command = `code-push release ${app} ${EXPORT_PATH} ${target_binary_range} -d ${deployment} --des ${description}`;
		exec(command, (e, stdout) => {
			if (e) throw e;
			console.log(stdout);
			rimraf.sync(EXPORT_PATH);
			console.log(`\nFinished.\n`);
			resolve();
		});
	});
};

const upload = async ({ filename, metadata }, app, deployment) => {
	await _unpackBundle(filename);
	await _uploadBundle(metadata, app, deployment);
};

module.exports = upload;
