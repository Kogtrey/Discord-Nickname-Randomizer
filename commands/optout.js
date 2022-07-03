const { SlashCommandBuilder } = require('@discordjs/builders')
const { Interaction } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optout')
            .setDescription('Opts a user out of having their nickname randomly changed'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optout`)
        //Get User In DB:
        client.userRepo.getById(interaction.user.id)
            .then( async (user) => {
                //If user exists, confirm opt out:
                if(user) {
                    await interaction.reply({
                        content: 'confirm in DM'
                    })
                    //Send dm to user:
                    const message = await interaction.user.send({
                        content: 'React with a thumbs up if you would like to erase all nickname data and opt out of nickname changing.',
                        fetchReply: true
                    })
                    message.react(':thumbsup:').then(() => message.react(':thumbsdown:'))
            
                    const filter = (reaction,usr) => {
                        return [':thumbsup:',':thumbsdown:'].includes(reaction.emoji.name) && usr.id === interaction.user.id
                    }
                    //Check for thumbs up reaction:
                    message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
                        .then( async (collected) => {
                            const reaction = collected.first()
                            //if thumbs up, remove from database
                            if (reaction.emoji.name === ':thumbsup:') {
                                client.userRepo.deleteByDiscordId(interaction.user.id)
                                await interaction.user.send('You are now opted out of nickname changing.')
                            } else {
                                await interaction.user.send('You have canceled the opt out process.')
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