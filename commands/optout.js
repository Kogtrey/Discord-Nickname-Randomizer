const { SlashCommandBuilder } = require('@discordjs/builders')
const { Interaction, InteractionCollector } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optout')
            .setDescription('Opts you out of having your nickname randomly changed, and deletes your set nicknames.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optout`)
        //Get User In DB:
        client.userRepo.getById(interaction.user.id)
            .then( async (nickNameUser) => {
                //If user exists, confirm opt out:
                if(nickNameUser) {
                    await interaction.reply({
                        content: 'Confirm in Direct Messages.'
                    })
                    //Send dm to user:
                    const message = await interaction.user.send({
                        content: 'React with a thumbs up if you would like to erase all nickname data and opt out of nickname changing.',
                        fetchReply: true
                    })
                    message.react('👍').then(() => message.react('👎'))
            
                    const filter = (reaction,user) => {
                        return reaction.emoji.name && user.id === interaction.user.id
                    }
                    //Check for thumbs up reaction:
                    message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
                        .then( async (collected) => {
                            const reaction = collected.first()
                            //if thumbs up, remove from database
                            if (reaction.emoji.name === '👍') {
                                //Remove User:
                                client.userRepo.delete(interaction.user.id)

                                //Remove nicknames associated to user:
                                client.nicknameRepo.getNicknames(interaction.user.id)
                                    .then( (nicknames) => {
                                        nicknames.forEach(nickname => {
                                            client.nicknameRepo.delete(nickname.id)
                                        });
                                    })

                                await interaction.user.send('You are now opted out of nickname changing.')
                                console.log(`Removed user ${interaction.user.username} and their nicknames from database`)
                            //if thumbs down, cancel removal from database:
                            } else {
                                await interaction.user.send('You have canceled the opt out process.')
                                console.log(`User ${interaction.username} canceled opting out`)
                            }
                        // If no reaction, notify that user needs to react for process to work:
                        })
                        .catch( async (collected) => {
                            await interaction.user.send('No reaction detected. To opt out try again and be sure to select the 👍.')
                        })
                } else {
                    interaction.reply({
                        content: `User ${interaction.user.username} is already opted out.`
                    })
                }
        })
    }
}