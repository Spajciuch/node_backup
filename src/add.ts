import { createInterface } from "readline";
import * as fs from "fs";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const backup_file = __dirname + "/backup_config.json";

export function run_add() {
    
}