# node_backup
**node_backup** is simple CLI app for creating backups. It saves file or directory as `.zip` archive in location provided during setup. You can use it with arguments:
- `node_backup -s` - enter setup (add/remove folders)
- `node-backup ./` - add execution folder to backup
- `node_backup -i` - change interval between backups. You can either provide number in ms in command or pass it later
- If you forget these, you can use `-help` 
## backup_config.json
You can customize this app by changing options in `backup_config.json` file.
- `interval` - time in milliseconds between full backups.

## Future goals
- more advanced backup options
- add option to setup backup in one command
- folder specific intervals between backups