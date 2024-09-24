import * as fs from "fs";
import * as path from "path";
import { createInterface } from "readline";
import { backup_entry, program_option } from "./types";
import * as config_utils from "./config_utils";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

export function run_setup(option: program_option = null, interval: program_option = null) {
    const backup_file = path.join(__dirname, '..', 'backup_config.json');

    console.log("[setup] Running backup_service setup\n");

    switch (option) {
        case null:
            readline.question("---- [ M E N U ] ----\n1. Add new entry\n2. Remove existing entries\nChoice: ", menu => {

                switch (menu) {
                    case "1":
                        readline.question("Full path to original file or folder: ", originalPath => {
                            readline.question("Destination path: ", destinationPath => {
                                config_utils.add_entry(originalPath, destinationPath, backup_file, readline);
                            });
                        });

                        break;
                    case "2":
                        const raw_data = fs.readFileSync(backup_file);
                        const backup_data = JSON.parse(raw_data.toString());

                        var backup_string = "";
                        var i = 1;

                        backup_data.paths.forEach((element: backup_entry) => {
                            backup_string += `${i}. SRC: ${element.originalPath} | DST: ${element.destinationPath}\n`;
                            i++;
                        });

                        readline.question(`\n---- [ BACKUP LIST] ----\n${backup_string}\nItems to remove: `, remove_menu => {
                            const remove_backup_options = remove_menu.split(" ").map(Number);
                            const remove_backup: Array<any> = [];

                            remove_backup_options.forEach((option: number) => {
                                remove_backup.push(backup_data.paths[option - 1]);
                            });

                            backup_data.paths = backup_data.paths.filter((entry: backup_entry) => !remove_backup.includes(entry));

                            i = 1;
                            backup_string = "";

                            remove_backup.forEach((element: backup_entry) => {
                                backup_string += `${i}. SRC: ${element.originalPath} | DST: ${element.destinationPath}\n`;
                                i++;
                            });
                            console.log(`\n---- [ ITEMS FOR REMOVAL ] ----\n` + backup_string);
                            readline.question("Following items will be removed.\nProceed? [y/N]: ", removing => {

                                readline.close();

                                if (removing.toLowerCase() == "y") {
                                    fs.writeFileSync(backup_file, JSON.stringify(backup_data));
                                } else {
                                    console.log("[setup] Closing setup...");
                                }
                            });
                        });

                        break;

                    default:
                        readline.close();
                        return console.log("[setup] Closing setup...");
                };
            });

            break;
        case "add":
            console.log("[setup] Adding this directory to backup database...");
            readline.question("Provide output directory for backup: ", destinationPath => {
                const originalPath = process.cwd();
                config_utils.add_entry(originalPath, destinationPath, backup_file, readline);
            });
            break;
        case "interval":

            if (!interval) {
                readline.question("Interval [ms]: ", time => {
                    config_utils.set_interval(Number(time), backup_file);
                });
            } else {
                config_utils.set_interval(Number(interval), backup_file);
            }

            readline.close();
    }
}