const { SlashCommandBuilder } = require('@discordjs/builders')
const { Interaction, InteractionCollector } = require('discord.js')

// TODO: SET UP GuildSync Logic

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optout')
            .setDescription('Opts you out of having your nickname randomly changed, and deletes your set nicknames.'),
    async execute(interaction,client){

        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optout`)
        //Get User In DB:
        let nicknameUser = await client.userRepo.getById(interaction.user.id)
        if(nicknameUser){
            await interaction.reply({
                content: 'Confirm in Direct Messages.'
            })
            //Send dm to user:
            const message = await interaction.user.send({
                content: 'React with a thumbs up if you would like to erase all nickname data and opt out of nickname changing.',
                fetchReply: true                
            })

            const filter = (reaction,user) => {
                return reaction.emoji.name && user.id === interaction.user.id
            }

            //Check for thumbs up reaction:
            message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
                .then(async(collected)=> {
                    const reaction = collected.first()
                    //if thumbs up, remove from database
                    if(reaction.emoji.name === '👍'){
                        //Remove user:
                        let guildUser = await client.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId)
                        console.log(guildUser)
                        if(guildUser){
                            await client.guildUserRepo.delete(guildUser.id)
                            console.log(`Removed nickname links at guild ${interaction.guildId} for user ${interaction.user.username}`)
                        }
                        
                        let existingGuildUsers = await client.guildUserRepo.getByUserId(interaction.user.id)
                        console.log(existingGuildUsers)
                        if(existingGuildUsers.length === 0){
                            client.userRepo.delete(interaction.user.id)
                            console.log(`Detected no existing GuildUsers, Removed user ${interaction.user.username} and their nicknames from database`)
                        }
                        //Remove nicknames associated to user:
                        // let nicknames = await client.nicknameRepo.getNicknames(interaction.user.id)
                        // if(nicknames){
                        //     nicknames.forEach(nickname=>{
                        //         client.nicknameRepo.delete(nickname.id)
                        //     })
                            
                        // }

                        await interaction.user.send('You are now opted out of nickname changing.')
                    //if thumbs down, cancel removal from database:
                    } else {
                        await interaction.user.send('You have canceled the opt out process.')
                        console.log(`User ${interaction.user.username} canceled opting out`)
                    }
                // If no reaction, notify that user needs to react for process to work:
                })
                .catch( async (collected) => {
                    await interaction.user.send('No reaction detected. To opt out try again and be sure to react with 👍.')
                })
        } else {
            interaction.reply({
                content: `User ${interaction.user.username} is already opted out.`
            })
        }
    }
}