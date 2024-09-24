import * as fs from "fs";
import { help_structure } from "./types";
import * as path from "path";

export function run_help() {
    const help_file = path.join(__dirname, '..', 'methods.json');
    const raw_data = fs.readFileSync(help_file);

    const help = JSON.parse(raw_data.toString());
    const message = form_output(help);

    console.log(message);
    process.exit(0);
}

function form_output(help: help_structure) {
    var help_string = "Possible methods:\n";

    help.methods.forEach(method => {
        method.arguments.forEach(argument => {
            help_string += argument + ` ${(method.parameters != undefined) ? `${method.parameters.map(wrap).join(" ")}` : ""}\n`;
        })
    });

    return help_string;
}

function wrap(string: string) {
    return `<${string}>`;
}