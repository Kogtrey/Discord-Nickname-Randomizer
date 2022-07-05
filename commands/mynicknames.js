//TODO: Command to list nicknames of current user
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('mynicknames')
            .setDescription('Displays current nicknames you have set.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /mynicknames`)
        client.userRepo.getById(interaction.user.id)
            .then( async (user) => {
                if(user){
                    //User is Opted In:
                    let nicknameString = `We have the following nicknames on record for \*\*${interaction.user.username}\*\*:\n\n`
                    client.nicknameRepo.getNicknames(interaction.user.id)
                        .then(async (nicknames) => {

                            if(nicknames.length > 0){
                                nicknames.forEach((nickname) => {
                                    nicknameString += `- ${nickname.nickname}\n`
                                });
    
                                await interaction.reply({
                                    content: nicknameString
                                })
                                
                            } else {
                                await interaction.reply({
                                    content: `There are no nicknames on record for \*\*${interaction.user.username}\*\*. Use \`/setnicknames\` to set a list.`
                                })
                            }

                        })
                } else {
                    //User is not Opted In:
                    await interaction.reply({
                        content: `User ${interaction.user.username} is not opted in. Type \`/optin\` to set nicknames.`
                    })
                }
            })
    }
}