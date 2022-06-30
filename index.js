//Database Dependencies:
const Promise = require('bluebird')
const DBM = require('./data/dbmanager')
const UserRepo = require('./data/Tables/UserRepo')
const NicknameRepo = require('./data/Tables/NicknameRepo')
const { resolve } = require('bluebird')

//Discord Dependencies:
const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client.js');
const config = require('./config.json');
const { MessageEmbed } = require('discord.js')
global.AbortController = require('node-abort-controller').AbortController;

//Initializations:
const client = new Client();
const dbm = new DBM('./data/db.sqlite3')
const userRepo = new UserRepo(dbm)
const nicknameRepo = new NicknameRepo(dbm)

client.commands = new Discord.Collection();
const commandfiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandfiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity('noobis torture kogtrey', { type: 'WATCHING' });
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

    if (!command) return;
    
    try {
        command.execute(interaction, client);
    
    } catch (error) {
        console.error(error);
        interaction.followUp({
            content: 'There was an error trying to execute that command!',
            ephemeral: true,
        });
    }
    
});


client.login(config.token);