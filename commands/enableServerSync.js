const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
        data: new SlashCommandBuilder()
            .setName('enableserversync')
            .setDescription('Enables users to sync nickname data across any server running the same bot'),
    async execute(interaction,client){

        async function Reply(message){
            await interaction.reply({
                content: message
            })
        }

        console.log(`User ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} sent /addnicknames`)

        let user = await client.userRepo.getById(interaction.user.id)
        if(!user){
           await Reply(`User ${interaction.user.username} is not opted in globally. Type \`/optin\` to set nicknames.`)
           return
        }

        let updatedUser = await client.userRepo.update({
            id: user.id,
            name: interaction.user.username,
            guildsync: 1
        })

        await Reply(`User ${user.name} is now globally synced!`)
    }
}