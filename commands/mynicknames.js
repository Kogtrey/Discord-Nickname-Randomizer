//TODO: Command to list nicknames of current user
const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mynicknames')
        .setDescription('Displays current nicknames you have set.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /mynicknames`)

        let user = await client.userRepo.getById(interaction.user.id)
        console.log(`${interaction.user.username} guild sync: ${user.guildsync}`)

        let guildUser = await client.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId)
        if(guildUser){
            //User is Opted In:
            let nicknameString = `We have the following nicknames on record for \*\*${interaction.user.username}\*\*:\n\n`
            let nicknames = await client.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id)

            if(nicknames.length > 0){ //Has nicknames:
                nicknames.forEach((nickname)=>{
                    nicknameString += `- ${nickname.nickname}\n`
                })

                await interaction.reply({
                    content: nicknameString
                })

            } else { //Does not have nicknames:
                await interaction.reply({
                    content: `There are no nicknames on record for \*\*${interaction.user.username}\*\*. Use \`/setnicknames\` to set a list.`
                })
            }
        } else {
            //User is not Opted In:
            await interaction.reply({
                content: `User ${interaction.user.username} is not opted in. Type \`/optin\` to set nicknames.`
            })
        }
    }
}