// scripts/deploy-commands.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const commandsDir = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

const commands = commandFiles.map((file) => {
    const command = require(path.join(commandsDir, file));
    return command.data.toJSON();
});

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    console.log(`Deploying ${commands.length} commands...`);

    // Global deploy:
    await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
    );

    console.log('Deployed global application commands.');
})().catch((err) => {
    console.error(err);
    process.exit(1);
});