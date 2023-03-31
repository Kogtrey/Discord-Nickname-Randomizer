const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optin')
            .setDescription('Opts you in to having your nickname randomly changed.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} sent /optin`)
        let user = await client.userRepo.getById(interaction.user.id)
        if(!user){ //User does not exist:
            
            await client.userRepo.create(interaction.user.id, interaction.user.username)
            await client.guildUserRepo.create(interaction.user.id, interaction.guildId)

            await interaction.reply({
                content: `User ${interaction.user.username} opted in!`
            })
            console.log(`Created user ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} in the database`)
            
        } else {//User exists

            let guildUser = await client.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId)
            
            if(!guildUser){
                await client.guildUserRepo.create(interaction.user.id, interaction.guildId)

                await interaction.reply({
                    content: `User ${interaction.user.username} opted in!`
                })
                console.log(`Created user ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} in the database`)
            } else {
                await interaction.reply({
                    content: `User ${interaction.user.username} already opted in.`
                })
                console.log(`User ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} already opted in`)    
            }
        }
    }
}