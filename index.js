//Database Dependencies:
const Promise = require('bluebird');
const DBM = require('./data/dbmanager');
const UserRepo = require('./data/Tables/UserRepo');
const NicknameRepo = require('./data/Tables/NicknameRepo');
const { resolve } = require('bluebird');

//Discord Dependencies:
const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client.js');
const config = require('./config.json');
const { MessageEmbed } = require('discord.js');
global.AbortController = require('node-abort-controller').AbortController;

//Other Dependencies:
const Cron = require('cron');

//Initializations:
const client = new Client();

client.commands = new Discord.Collection();
const commandfiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandfiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    client.userRepo.createTable();
    client.nicknameRepo.createTable();

    let scheduledNicknameChange = new Cron.CronJob('*/1 * * * *', async () =>{
        //get guild:
       await client.guilds.fetch(config.guildId)
            .then( async (guild) => {
                //Get all users:
                client.userRepo.getAll()
                    .then( async (users) => {
                    //Get nicknames for this user:
                        users.forEach( async (user) => {
                            console.log(`Database User: ${user.name} : ${user.id}`)
                            //Get Guild Member:
                            await guild.members.fetch(user.id)
                                .then((member) =>{
                                    //Get users nicknames
                                    client.nicknameRepo.getNicknames(user.id)
                                        .then((nicknames) => {
                                            //Change users nickname:
                                            member.setNickname(nicknames[Math.floor(Math.random()*nicknames.length)].nickname)
                                        });
                                });
                        });
                    });
            });
    });

	console.log('Ready!');
    client.user.setActivity('noobis torture kogtrey', { type: 'WATCHING' });

    scheduledNicknameChange.start()
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