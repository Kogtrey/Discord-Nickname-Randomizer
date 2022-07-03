const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optin')
            .setDescription('Opts a user in to have their nickname randomly changed'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optin`)
        client.userRepo.getByDiscordId(interaction.user.id)
            .then((user) => {
                if(!user){
                    client.userRepo.create(interaction.user.username, interaction.user.id)
                    interaction.reply(`User ${interaction.user.username} opted in!`)
                } else {
                    interaction.reply(`User ${interaction.user.username} already opted in (id: ${user.id})`)
                }
            })
    }
}