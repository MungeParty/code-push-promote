#!/usr/bin/env node --harmony
"use strict";
const meow = require("meow");
const promote = require("./src/promote");

const usage = `
Usage
	$ code-push-promote -k [key] -a [app] -d [deployment]

Options
	-v    App target version.
	-k    Source deployment key.
	-a    Destination app.
	-d    Destination deployment name.


Examples
	$ code-push-promote -k 12hM3840Fes18273c407zz612Su87U36498my -a MyAppName -d Production
`;

const flags = {
	k: {
		type: "string",
		alias: "k",
		default: "key"
	},
	v: {
		type: "string",
		alias: "v",
		default: "version"
	},
	a: {
		type: "string",
		alias: "a",
		default: "app"
	},
	d: {
		type: "string",
		alias: "d",
		default: "deployment"
	}
};

const cli = meow(usage, flags);

const { v, k, a, d } = cli.flags;
const badInput = !v || !k || !a || !d;
if (badInput) {
	console.log(usage);
	return;
}

promote(v, k, a, d);
