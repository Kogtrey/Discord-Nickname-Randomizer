const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optin')
            .setDescription('Opts a user in to have their nickname randomly changed'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optin`)
        client.userRepo.getById(interaction.user.id)
            .then( async (user) => {
                if(!user){
                    client.userRepo.create(interaction.user.id, interaction.user.username)
                    await interaction.reply({
                        content: `User ${interaction.user.username} opted in!`
                    })
                } else {
                    await interaction.reply({
                        content: `User ${interaction.user.username} already opted in.`
                    })
                }
            })
    }
}