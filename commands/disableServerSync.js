const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
        data: new SlashCommandBuilder()
            .setName('disableserversync')
            .setDescription('Disables nickname data syncing across servers running the same bot'),
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
            guildsync: 0
        })

        await Reply(`User ${user.name} is no longer globally synced`)
    }
}