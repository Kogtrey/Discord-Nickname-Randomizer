const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optin')
            .setDescription('Opts you in to having your nickname randomly changed.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /optin`)
        let user = await client.userRepo.getById(interaction.user.id)
        if(!user){ //User does not exist:
            client.userRepo.create(interaciton.user.id, interaction.user.username )
            await interaction.reply({
                content: `User ${interaction.user.username} opted in!`
            })
            console.log(`Created user ${interaction.user.username} : ${interaction.user.id} in the database`)
        } else {//User exists
            await interaction.reply({
                content: `User ${interaction.user.username} already opted in.`
            })
            console.log(`User ${interaction.user.username} : ${interaction.user.id} already opted in`)
        }
    }
}