//Database Dependencies:
const Promise = require('bluebird');
const DBM = require('./data/dbmanager');
const UserRepo = require('./data/Tables/UserRepo');
const NicknameRepo = require('./data/Tables/NicknameRepo');
const GuildUserRepo = require('./data/Tables/GuildUserRepo');
const GuildUserNickname = require('./data/Tables/GuildUserNicknameRepo');
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
const { Console } = require('console');
const commandmanager = require('./commandmanager');
const { DiscordAPIError } = require('@discordjs/rest');

//Initializations:
const client = new Client();

client.commands = new Discord.Collection();
const commandfiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandfiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

commandmanager.deploycommands(client)


client.once('ready', async () => {
    client.userRepo.createTable();
    client.nicknameRepo.createTable();
    client.guildUserRepo.createTable();
    client.guildUserNicknameRepo.createTable();


    let scheduledNicknameChange = new Cron.CronJob('0 0 */1 * *', async () =>{
        console.log("Starting scheduled nickname change...")
        // Get list of registered guilds:
        let guilds = await client.guilds.fetch()
        //console.log(guilds)
        // If bot is not in any servers, report and skip:
        if(!(guilds.size> 0)){
            console.log('No registered guilds. Skipping.')
            return
        }
        // Iterate through guilds
        guilds.each(async guild=>{
            //console.log(guild)

            guild = await client.guilds.fetch(guild.id)

            // Filter users by guild
            let guildUsers = await client.guildUserRepo.getGuildUserInfoByGuildId(guild.id)
            // If no users in current guild, report and skip:
            if(!(guildUsers.length > 0)){
                console.log("No opted in users in guild ${}")
                return
            }
            // Iterate through current guild's users:
            guildUsers.forEach( async (guildUser)=>{
                // Get discord member:
                let member = await guild.members.fetch(guildUser.userId)
                //console.log(member)

                // Function to update member to random nickname:
                async function UpdateNickname(nicknames){
                    let oldnickname = member.nickname
                    let newnickname = nicknames[Math.floor(Math.random()*nicknames.length)].nickname
                    
                    if(nicknames.length === 1){
                        newnickname = nicknames[0]
                        oldnickname = null
                    }

                    while(oldnickname === newnickname){
                        newnickname = nicknames[Math.floor(Math.random()*nicknames.length)].nickname
                    }
                    try{
                        await member.setNickname(newnickname)
                        console.log(`Changed nickname for ${guildUser.name} : ${guildUser.userId} @ ${guild.id} to ${newnickname} (Originally ${oldnickname})`)
                        

                    } catch (DiscordAPIError){
                        console.error(`Cannot change nickname for ${guildUser.name}. Owner nicknames cannot be changed.`)
                    }
                    
                }

                // If member not found in current guild, report error and skip:
                if(!member){
                    console.error(`Failed to find member ${guildUser.userId} @ ${guild.id}`)
                    return
                }

                console.log(`Checking GuildUser ${guildUser.name} @ ${guild.id}`)
                // If parent user is guild synced, pull from pool of all user created nicknames:
                if(guildUser.guildsync === 1){
                    console.log(`${guildUser.name} is seversynced`)
                    let nicknames = await client.nicknameRepo.getNicknames(guildUser.userId)
                    // If no nicknames to pull, report and skip:
                    if(!(nicknames.length > 0)){
                        console.log(`User ${guildUser.name} : ${GuildUser.userId} has no nicknames to change to.`)
                        return
                    }

                    // Update nickname and finish:
                    await UpdateNickname(nicknames)
                    return
                }

                // Parent user is not guild synced, so pull from current guild user nickname pool:
                let nicknames = await client.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id)
                // If no nicknames to pull, report and skip:
                if(!(nicknames.length > 0)){
                    console.log(`User ${guildUser.name} : ${guildUser.userId} @ ${guild.id} has no nicknames to change to.`)
                    return
                }
                // Update nickname and finish:
                await UpdateNickname(nicknames)
            })
        })
    });

    let scheduledWorkActivityChange = new Cron.CronJob('0 6 */1 * *', async ()=>{
        ChangeBotActivity('work. [Work Noises]')
    })
    let scheduledSleepActivityChange = new Cron.CronJob('0 20 */1 * *', async ()=>{
        ChangeBotActivity('sleep. Zzzzzz')
    })

	console.log('Ready!');
    await ChangeBotActivity('float through space. [space non-noises]')

    scheduledNicknameChange.start()
    scheduledSleepActivityChange.start()
    scheduledWorkActivityChange.start()
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

async function ChangeBotActivity(activityText){
    let KogsNicknames = await client.nicknameRepo.getNicknames("214082690733965312")
    let nickname = KogsNicknames[Math.floor(Math.random()*KogsNicknames.length)].nickname
    client.user.setActivity(`${nickname} ${activityText}`, { type: 'WATCHING' });
}


client.login(config.token);