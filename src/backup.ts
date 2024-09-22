import * as fs from "fs";
import archiver from "archiver";

import { backup_entry } from "./types";

export function run_backup() {
    const backup_file = __dirname + "/backup_config.json";

    const raw_data = fs.readFileSync(backup_file);
    const backup_data = JSON.parse(raw_data.toString());

    const backup_interval = instantInterval(function () {
        backup_data.paths.forEach((entry: backup_entry) => {
            console.log("[backup] Started backup with interval of ", backup_data.interval);
            backup(entry.originalPath, entry.destinationPath);
        });
    }, backup_data.interval);

    fs.watchFile(backup_file, () => {
        clearInterval(backup_interval);
        console.log("[backup] Killed previous interval, starting new due to settings change")
        run_backup();
    });
}

function backup(source: string, destination: string) {
    const date = new Date();
    const date_signature = `${("0" + date.getDay()).slice(-2)}.${("0" + date.getMonth()).slice(-2)}.${date.getFullYear()}`;

    const folder = source.split("/").at(-1) || "backup";
    const destination_path = destination + "/" + folder + `-${date_signature}`;
    const output = fs.createWriteStream(destination_path + ".zip");

    console.log(`[backup - ${folder}] Beginning backup...`)

    const archive = archiver("zip", {
        zlib: { level: 9 }
    });

    output.on("close", function () {
        console.log(`[backup - ${folder}] ` + archive.pointer() + " total bytes");
        console.log(`[backup - ${folder}] Archiver has been finalized and the output file descriptor has closed.`);
    });

    output.on("end", function () {
        console.log("Data has been drained");
    });

    archive.on("warning", function (err) {
        if (err.code === "ENOENT") {
            console.error(`[archiver] ${err}`);
        } else {
            throw err;
        }
    });

    archive.on("error", function (err) {
        throw err;
    });

    archive.pipe(output);
    archive.directory(source, folder.toString());
    archive.finalize();
}

function instantInterval(fn: Function, delay: number) {
    fn();
    const backup_interval = setInterval(fn, delay);
    return backup_interval;
}