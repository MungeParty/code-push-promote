const download = require("./download");
const upload = require("./upload");

const promote = async (version, key, app, deployment) => {
	const bundle = await download(version, key);
	await upload(bundle, app, deployment);
}

module.exports = promote;
