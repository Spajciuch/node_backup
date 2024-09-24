import * as fs from "fs";
import { Interface } from "readline";

export function add_entry(originalPath: string, destinationPath: string, backup_file: string, readline: Interface) {
    const backup_object = {
        originalPath: originalPath,
        destinationPath: destinationPath
    };

    console.log(backup_object);
    readline.question("\nDoes it look ok? [y/N]: ", final => {
        readline.close();

        if (final.toLowerCase() == "y") {
            const raw_data = fs.readFileSync(backup_file);
            const backup_data = JSON.parse(raw_data.toString());

            backup_data.paths.push(backup_object);
            fs.writeFileSync(backup_file, JSON.stringify(backup_data));

        } else return console.log(`[setup] Closing setup...`);
    });
}

export function set_interval(time: number, backup_file: string) {
    const raw_data = fs.readFileSync(backup_file);
    const backup_data = JSON.parse(raw_data.toString());

    backup_data.interval = time;
    fs.writeFileSync(backup_file, JSON.stringify(backup_data));
    console.log("[setup] Changed interval time to: ", time);
}