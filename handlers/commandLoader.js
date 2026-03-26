// handlers/commandLoader.js
const fs = require('fs');
const path = require('path');

function loadCommands(client, commandsDir = path.join(process.cwd(), 'commands')) {
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

    for (const file of files) {
        const command = require(path.join(commandsDir, file));
        if (!command?.data?.name || typeof command.execute !== 'function') {
            client.logger.warn(`Skipping invalid command file: ${file}`);
            continue;
        }
        client.commands.set(command.data.name, command);
    }

    client.logger.info(`Loaded ${client.commands.size} commands.`);
}

module.exports = { loadCommands };