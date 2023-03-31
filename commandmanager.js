const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId} = require('./config.json');
const fs = require('node:fs');

const commands = []; //initialize
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //Get all command definitions

// Iterate through command definitions and require them to be loaded:
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);


module.exports = {
	async deploycommands(client){
		try {
			console.log('Started refreshing application (/) commands.');
	
			let guilds = await client.guilds.fetch()
			guilds.each(async ({ id })=>{
				await rest.put(
					Routes.applicationGuildCommands(clientId, id),
					{ body: commands },
				);
			})
	
			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	}
}