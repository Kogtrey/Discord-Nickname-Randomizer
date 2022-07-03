const { SlashCommandBuilder } = require('@discordjs/builders')
const { Interaction } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optout')
            .setDescription('Opts a user out of having their nickname randomly changed'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optout`)
       
        await interaction.reply({
            content: 'confirm in DM'
        })
        const message = await interaction.user.send('it works')
        message.react('👍').then(() => message.react('👎'))

        const filter = (reaction, user) => {
            return ['👍','👎'].includes(reaction.emoji.name) && user.id === interaction.user.id
        }

        message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '👍') {

                } else {

                }
            })
            .catch(collected => {
                
            })
        //client.userRepo.getByDiscordId(interaction.user.id)
        //     .then((user) => {
        //        if(user){
        //           client.userRepo.deleteByDiscordId(interaction.user.id)
        //           interaction.reply(`User ${interaction.user.username} has opted out.`)
        //        } else {
        //            interaction.reply(`User ${interaction.user.username} is already opted out.`)
        //        }
        //    })
    }
}