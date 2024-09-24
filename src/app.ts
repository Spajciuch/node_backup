#!/usr/bin/env node

import { run_setup } from "./setup";
import { run_backup } from "./backup";
import { run_help } from "./help";

import fs from "fs";

const args = process.argv.splice(2);
const backup_file = __dirname + "/backup_config.json";

if (!fs.existsSync(backup_file)) {
    const example_json = {
        paths: [],
        interval: 3600000
    };

    fs.writeFileSync(backup_file, JSON.stringify(example_json));
}

switch (args[0]) {
    case "-s":
    case "-setup":
        run_setup();
        break;
    case "-a":
    case "-add":
    case "./":
        run_setup("add");
        break;
    case "-i":
    case "-interval":
        run_setup("interval", args[1]);
        break;
    case undefined: 
        run_backup();
        break;
    default:
        run_help();
};