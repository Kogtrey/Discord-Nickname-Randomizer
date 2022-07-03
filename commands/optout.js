const { SlashCommandBuilder } = require('@discordjs/builders')
const { Interaction } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optout')
            .setDescription('Opts a user out of having their nickname randomly changed'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optout`)
        //Get User In DB:
        client.userRepo.getByDiscordId(interaction.user.id)
            .then((user) => {
                //If user exists, confirm opt out:
            if(user) {
                interaction.reply({
                    content: 'confirm in DM'
                })
                //Semd dm to user:
                const message = interaction.user.send('React with a thumbs up if you would like to erase all nickname data and opt out of nickname changing.')
                message.react('👍').then(() => message.react('👎'))
        
                const filter = (reaction, user) => {
                    return ['👍','👎'].includes(reaction.emoji.name) && user.id === interaction.user.id
                }
                //Check for thumbs up reaction:
                message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first()
                        //if thumbs up, remove from database
                        if (reaction.emoji.name === '👍') {
                            client.userRepo.deleteByDiscordId(interaction.user.id)
                            interaction.user.send('You are not opted out of nickname changing.')
                        } else {
                            interaction.user.send('You have canceled the opt out process. Send /optout in the channel again to start over.')
                        }
                    })
                    .catch(collected => {
                        
                    })
            } else {
                interaction.reply({
                    content: `User ${interaction.user.username} is already opted out.`
                })
            }
        })
    }
}