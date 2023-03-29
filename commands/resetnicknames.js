//TODO: Command to remove nicknames for given user.
//TODO: Command to list nicknames of current user
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('resetnicknames')
            .setDescription('Removes all of your current set nicknames.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /resetnicknames`)
        let user = await client.userRepo.getById(interaction.user.id)
        if(user){//User is Opted In:
            //Remove nicknames associated to user:
            let nicknames = await client.nicknameRepo.getNicknames(interaction.user.id)
            nicknames.forEach(nickname => {
                client.nicknameRepo.delete(nickname.id)
            });

            await interaction.reply({
                content: `Your nicknames have been removed. To add nicknames again, type \`/setnicknames\`.`
            })

            console.log(`Removed nicknames for User ${interaction.user.username}`)

        } else {
            //User is not Opted In:
            await interaction.reply({
                content: `User ${interaction.user.username} is not opted in. Type \`/optin\` to set nicknames.`
            })
        }
    }
}