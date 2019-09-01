const fetch = require("isomorphic-fetch");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { CODEPUSH_URL, DOWNLOAD_PATH } = require("./constants");

const _updateCheck = async (version, key) => {
	console.log(
		`\nRequesting bundle for app version ${version} at key: \n${key}`
	);
	const url = `${CODEPUSH_URL}?app_version=${version}&deployment_key=${key}`;
	const metadata = (await (await fetch(url)).json()).update_info;
	const { description, label, target_binary_range } = metadata;
	console.log(
		`\nFound bundle with metadata: \n  target_binary_range: ${target_binary_range} \n  description: ${description} \n  label: ${label}`
	);
	return metadata;
};

const _downloadUpdate = async ({ download_url, package_hash }) => {
	console.log(`\nDownloading bundle from: \n${download_url}`);
	return new Promise(resolve => {
		fs.mkdir(DOWNLOAD_PATH, async e => {
			if (e && e.code !== "EEXIST")
				throw new Error("\nUnable to create download folder.");
			const filename = `${DOWNLOAD_PATH}/${package_hash}`;
			const file = fs.createWriteStream(filename);
			console.log(`\nOpened stream to: \n${path.resolve(filename)}`);
			https.get(download_url, response => {
				response.pipe(file);
				file.on("finish", () => {
					console.log(`Download complete.`);
					file.close(() => {
						resolve(filename);
					});
				});
			});
		});
	});
};

const download = async (version, key) => {
	const metadata = await _updateCheck(version, key);
	const filename = await _downloadUpdate(metadata);
	return { metadata, filename };
};

module.exports = download;
