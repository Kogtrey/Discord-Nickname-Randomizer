const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optin')
            .setDescription('Opts you in to having your nickname randomly changed.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optin`)
        client.userRepo.getById(interaction.user.id)
            .then( async (user) => {
                if(!user){
                    client.userRepo.create(interaction.user.id, interaction.user.username)
                    await interaction.reply({
                        content: `User ${interaction.user.username} opted in!`
                    })
                    console.log(`Created user ${interaction.user.username} : ${interaction.user.id} in the database`)
                } else {
                    await interaction.reply({
                        content: `User ${interaction.user.username} already opted in.`
                    })
                }
            })
    }
}