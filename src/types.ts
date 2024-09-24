export interface backup_entry {
    originalPath: string,
    destinationPath: string
}

export type program_option = string|null;

export interface method {
    description: string,
    arguments: Array<string>,
    parameters: Array<string>|null
}

export interface help_structure {
    methods: Array<method>
}